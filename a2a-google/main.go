package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"
	"sync"
	"time"

	"github.com/google/uuid"
)

type TaskStatus string

const (
	StatusSubmitted     TaskStatus = "submitted"
	StatusWorking       TaskStatus = "working"
	StatusInputRequired TaskStatus = "input-required"
	StatusCompleted     TaskStatus = "completed"
)

type Task struct {
	ID       string                 `json:"id"`
	Input    map[string]interface{} `json:"input"`
	Metadata map[string]interface{} `json:"metadata"`
	Output   map[string]interface{} `json:"output,omitempty"`
	Status   TaskStatus             `json:"status"`
	Messages []Message              `json:"messages,omitempty"`
	Created  time.Time              `json:"created"`
}

type Message struct {
	Timestamp time.Time              `json:"timestamp"`
	Sender    string                 `json:"sender"`
	Content   map[string]interface{} `json:"content"`
}

var (
	tasks   = make(map[string]*Task)
	taskMux sync.RWMutex
)

func main() {
	http.HandleFunc("/agent", withCORS(getAgent))
	http.HandleFunc("/tasks", withCORS(createTask))
	http.HandleFunc("/tasks/", withCORS(taskRouter))
	log.Fatal(http.ListenAndServe(":8080", nil))
}

func getAgent(w http.ResponseWriter, r *http.Request) {
	response := map[string]interface{}{
		"id":          "approval-agent",
		"name":        "Approval Assistant",
		"version":     "1.0",
		"description": "Helps users resolve proposal approval issues.",
		"capabilities": []map[string]string{
			{"input_type": "text", "output_type": "text", "function": "approval-assist"},
		},
	}
	json.NewEncoder(w).Encode(response)
}

func createTask(w http.ResponseWriter, r *http.Request) {
	var body struct {
		Input    map[string]interface{} `json:"input"`
		Metadata map[string]interface{} `json:"metadata"`
	}
	json.NewDecoder(r.Body).Decode(&body)
	id := uuid.New().String()
	task := &Task{
		ID:       id,
		Input:    body.Input,
		Metadata: body.Metadata,
		Status:   StatusWorking,
		Created:  time.Now(),
	}
	response := handleApprovalLogic(task, "")
	taskMux.Lock()
	tasks[id] = response
	taskMux.Unlock()
	log.Printf("🆕 Task created: ID=%s, Metadata=%v", id, body.Metadata)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func taskRouter(w http.ResponseWriter, r *http.Request) {
	id := strings.TrimPrefix(r.URL.Path, "/tasks/")
	if strings.HasSuffix(id, "/events") {
		handleTaskEvents(w, r, strings.TrimSuffix(id, "/events"))
		return
	}
	if strings.HasSuffix(id, "/messages") {
		handleMessages(w, r, strings.TrimSuffix(id, "/messages"))
		return
	}
	switch r.Method {
	case http.MethodGet:
		taskMux.RLock()
		task := tasks[id]
		taskMux.RUnlock()
		json.NewEncoder(w).Encode(task)
	}
}

func handleMessages(w http.ResponseWriter, r *http.Request, taskID string) {
	switch r.Method {
	case http.MethodPost:
		var msg struct {
			Content map[string]interface{} `json:"content"`
			Sender  string                 `json:"sender"`
		}
		json.NewDecoder(r.Body).Decode(&msg)
		taskMux.Lock()
		task := tasks[taskID]
		log.Printf("📩 Message received from %s: %v", msg.Sender, msg.Content["value"])
		message := Message{
			Timestamp: time.Now(),
			Sender:    msg.Sender,
			Content:   msg.Content,
		}
		task.Messages = append(task.Messages, message)
		updated := handleApprovalLogic(task, msg.Content["value"].(string))
		tasks[taskID] = updated
		taskMux.Unlock()
		json.NewEncoder(w).Encode(updated)
	}
}

func handleApprovalLogic(task *Task, userResponse string) *Task {
	_, ok := task.Metadata["proposalId"].(string)
	if !ok {
		task.Output = map[string]interface{}{
			"type":  "text",
			"value": "Missing or invalid proposalId.",
		}
		task.Status = StatusCompleted
		return task
	}

	if userResponse == "" {
		log.Println("📨 Starting initial proposal message.")
		return handleInitialProposalMessage(task)
	}

	lower := strings.ToLower(userResponse)
	if strings.Contains(lower, "error") || strings.Contains(lower, "erro") {
		log.Println("🔎 Routing to Pricing Agent (MCP Client).")
		return consultPricingAgent(task)
	}

	if lower == "yes" || lower == "fix" || lower == "corrigir" {
		log.Println("🤖 Routing to Proposal Agent (LLM).")
		return handleProposalCorrection(task)
	}

	log.Println("⚠️ Unrecognized input, waiting for further interaction.")
	return task
}

func handleTaskEvents(w http.ResponseWriter, r *http.Request, taskID string) {
	flusher, ok := w.(http.Flusher)
	if !ok {
		http.Error(w, "Streaming unsupported", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "text/event-stream")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Connection", "keep-alive")

	notify := w.(http.CloseNotifier).CloseNotify()
	ticker := time.NewTicker(2 * time.Second)
	defer ticker.Stop()

	lastCount := 0

	for {
		select {
		case <-ticker.C:
			taskMux.RLock()
			task := tasks[taskID]
			taskMux.RUnlock()
			if task != nil && len(task.Messages) > lastCount {
				for i := lastCount; i < len(task.Messages); i++ {
					msg := task.Messages[i]
					payload, _ := json.Marshal(msg)
					fmt.Fprintf(w, "data: %s\n\n", payload)
					log.Printf("📤 [Task %s] Message from %s via SSE: %v", task.ID, msg.Sender, msg.Content["value"])
				}
				flusher.Flush()
				lastCount = len(task.Messages)
			}
		case <-notify:
			return
		}
	}
}

func withCORS(h http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}
		h(w, r)
	}
}
