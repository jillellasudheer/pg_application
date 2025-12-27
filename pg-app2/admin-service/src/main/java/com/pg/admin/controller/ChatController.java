package com.pg.admin.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.pg.admin.entity.User;
import com.pg.admin.repository.UserRepository;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

	private final UserRepository userRepository;
	private final RestTemplate restTemplate = new RestTemplate();

	@Value("${openai.api.key}")
	private String openaiApiKey;

	public ChatController(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	@PostMapping
	public ResponseEntity<Map<String, String>> chat(@RequestBody Map<String, String> request) {
		String message = Optional.ofNullable(request.get("message")).orElse("").trim();
		String response;

		try {
			// ✅ Handle DB queries first
			response = handleDatabaseQueries(message);

			// ✅ If no DB match → fallback to OpenAI
			if (response == null) {
				response = callOpenAi(message);
			}
		} catch (Exception e) {
			response = "⚠️ Error: " + e.getMessage();
		}

		return ResponseEntity.ok(Map.of("reply", response));
	}

	/** ✅ Handle supported DB queries */
	private String handleDatabaseQueries(String message) {
		String lowerMsg = message.toLowerCase();

		if (lowerMsg.equals("list users")) {
			return formatUsersTable(userRepository.findAll(), "All Users");
		}

		if (lowerMsg.startsWith("rent")) {
			String[] parts = message.split(" ");
			if (parts.length > 1) {
				try {
					Long userId = Long.parseLong(parts[1]);
					return userRepository.findById(userId)
							.map(u -> formatUsersTable(List.of(u), "Rent for User " + u.getUserName()))
							.orElse("⚠️ User not found!");
				} catch (NumberFormatException e) {
					return "⚠️ Invalid user ID format.";
				}
			}
			return "Please specify user ID after 'rent'.";
		}

		if (lowerMsg.startsWith("name starts with")) {
			String prefix = message.substring("name starts with".length()).trim();
			List<User> users = userRepository.findAll().stream()
					.filter(u -> u.getUserName().toLowerCase().startsWith(prefix.toLowerCase()))
					.collect(Collectors.toList());
			return formatUsersTable(users, "Users starting with " + prefix);
		}

		if (lowerMsg.startsWith("room number")) {
			String room = message.substring("room number".length()).trim();
			List<User> users = userRepository.findAll().stream().filter(u -> u.getUserRoom().equalsIgnoreCase(room))
					.collect(Collectors.toList());
			return formatUsersTable(users, "Users in room " + room);
		}

		if (lowerMsg.startsWith("mobile starts with")) {
			String prefix = message.substring("mobile starts with".length()).trim();
			List<User> users = userRepository.findAll().stream().filter(u -> u.getUserMobile().startsWith(prefix))
					.collect(Collectors.toList());
			return formatUsersTable(users, "Users with mobile starting " + prefix);
		}

		if (lowerMsg.startsWith("aadhar")) {
			String key = message.substring("aadhar".length()).trim();
			List<User> users = userRepository.findAll().stream().filter(u -> u.getUserAadhar().contains(key))
					.collect(Collectors.toList());
			return formatUsersTable(users, "Users with Aadhaar containing " + key);
		}

		if (lowerMsg.startsWith("place")) {
			String place = message.substring("place".length()).trim();
			List<User> users = userRepository.findAll().stream()
					.filter(u -> u.getUserPlace().toLowerCase().contains(place.toLowerCase()))
					.collect(Collectors.toList());
			return formatUsersTable(users, "Users from " + place);
		}

		return null; // Not a DB query → pass to AI
	}

	/** ✅ Helper: Format users into table style text (without email) */
	private String formatUsersTable(List<User> users, String title) {
		if (users.isEmpty()) {
			return "⚠️ No results for " + title;
		}

		StringBuilder sb = new StringBuilder();
		sb.append("📋 ").append(title).append("\n\n");
		sb.append(String.format("%-5s %-15s %-10s %-12s %-10s %-10s\n", "ID", "Name", "Room", "Mobile", "Rent",
				"E-Bills"));
		sb.append("-------------------------------------------------------------\n");

		for (User u : users) {
			sb.append(String.format("%-5s %-15s %-10s %-12s %-10s %-10s\n", u.getUserId(), u.getUserName(),
					u.getUserRoom(), u.getUserMobile(), u.getUserMonthlyRent(), u.getUserEbill()));
		}
		return sb.toString();
	}

	/** ✅ Call OpenAI if no DB query matches */
	private String callOpenAi(String message) {
		try {
			String openAiUrl = "https://api.openai.com/v1/chat/completions";

			HttpHeaders headers = new HttpHeaders();
			headers.setContentType(MediaType.APPLICATION_JSON);
			headers.setBearerAuth(openaiApiKey);

			Map<String, Object> body = new HashMap<>();
			body.put("model", "gpt-4o-mini");
			body.put("messages", List.of(Map.of("role", "user", "content", message)));

			HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

			Map<String, Object> aiResponse = restTemplate.postForObject(openAiUrl, entity, Map.class);
			if (aiResponse != null && aiResponse.containsKey("choices")) {
				List<Map<String, Object>> choices = (List<Map<String, Object>>) aiResponse.get("choices");
				return (String) ((Map<String, Object>) choices.get(0).get("message")).get("content");
			}
		} catch (Exception e) {
			return "❌ Failed to get AI response: " + e.getMessage();
		}
		return "❌ No response from AI.";
	}
}
