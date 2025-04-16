package main

import "time"

func consultPricingAgent(task *Task) *Task {
	message := Message{
		Timestamp: time.Now(),
		Sender:    "agent",
		Content: map[string]interface{}{
			"type": "text",
			"value": "Consulting pricing agent...\n" +
				"We detected inconsistencies in proposal 321:\n" +
				"- Item 1 should be priced at $10 but is currently $60.\n" +
				"- Item 2 should be priced at $15 but is currently $40.\n" +
				"Would you like to confirm the correction?",
		},
	}
	task.Messages = append(task.Messages, message)
	task.Status = StatusInputRequired
	return task
}
