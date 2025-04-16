# 💬 A2A POC – Conversando com agentes para resolver problemas de negócio

Essa POC mostra como um usuário final pode resolver erros ou inconsistências diretamente com agentes automatizados, usando o protocolo [A2A (Agent-to-Agent)](https://google.github.io/A2A/#/documentation), da Google.

## 🧠 Conceito

Em vez de depender do suporte ou de uma nova interface, o usuário conversa com um agente via frontend. O backend (em Go) gerencia as tarefas e delega para agentes especializados:

- 🧮 **Pricing Agent** → Consulta sistema externo via MCP Client
- 🧠 **Proposal Agent** → Usa LLM API para validar e sugerir correções
- 🛠️ Estrutura pronta para novos agentes (ex: compliance, financeiro…)

---

## 🧱 Arquitetura

```
[React Frontend] ⇄ [A2A Task Manager - Golang Backend]
                                   |
              ┌────────────────────┴────────────────────┐
              |                                         |
        [Pricing Agent]                         [Proposal Agent]
         (MCP Client → MCP Server)         (LLM API → NLP response)
```

---

## 📁 Estrutura do repositório

```
/
├── frontend-a2a/   # Next.js + Tailwind + React + Atomic Design
├── backend-a2a/    # Go + A2A + agentes (pricing, proposal)
```

---

## ▶️ Como rodar localmente

### Backend

```bash
cd backend-a2a
go run main.go
```

### Frontend

```bash
cd frontend-a2a
npm install
npm run dev
```

Acesse o frontend em: [http://localhost:3000](http://localhost:3000)

---

## 🎯 Tecnologias utilizadas

- React + Next.js
- Tailwind CSS
- Golang
- SSE (Server-Sent Events)
- A2A Protocol
- Modularização com MCP + LLM
- Atomic Design (frontend)

---

## 🎥 Demonstração



---

## 📄 Licença

MIT
