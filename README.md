# 💬 ChatGPT Clone

A modern **ChatGPT Clone** built with **Next.js, TypeScript, Tailwind CSS**, and powered by **Vercel AI SDK**.  
It comes with **real-time message streaming**, **memory-powered conversations**, **file & image uploads**, and **secure authentication**.  
Deployed seamlessly on **Vercel** 🚀.

---

## ✨ Features

- ⚡ **AI Responses with Streaming** – Smooth UI updates while AI types.  
- 🧠 **Context Window Handling** – Maintains conversation context across chats.  
- 🔄 **Editable Messages & Regeneration** – Update messages and regenerate AI responses.  
- 🗂 **Persistent Memory (via [mem0](https://mem0.ai))** – Conversations that remember context.  
- 📂 **File & Image Uploads** – Integrated with **Cloudinary** for media handling.  
- 🔐 **Authentication** – Powered by [Clerk](https://clerk.com) for sign-in/sign-up.  
- 🗃 **Database** – Chat storage with **MongoDB**.  
- 📱 **Responsive UI** – Optimized for desktop & mobile.  
- 🎨 **Clean Design** – Tailwind CSS for beautiful, consistent styling.  
- ☁️ **Deployment** – Ready-to-run on **Vercel**.

---

## 🛠 Tech Stack

- **Frontend:** Next.js 15, TypeScript, Tailwind CSS  
- **AI SDK:** [Vercel AI SDK](https://sdk.vercel.ai)  
- **Auth:** [Clerk](https://clerk.com)  
- **Database:** MongoDB  
- **Memory:** [mem0](https://mem0.ai)  
- **Media Storage:** Cloudinary  
- **Hosting:** Vercel  

---

## ⚙️ Getting Started

### 1. Clone the Repo
```bash
git clone https://github.com/tushar21o7/ChatGPT-Clone.git
cd ChatGPT-Clone
```

### 2. Set Environment Variables
```env
MONGO_URI=''
GOOGLE_GENERATIVE_AI_API_KEY=''
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=''
CLERK_SECRET_KEY=''
MEM0_API_KEY=''
CLOUDINARY_CLOUD_NAME=''
CLOUDINARY_API_KEY=''
CLOUDINARY_API_SECRET=''
```

### 3. Install dependencies and run locally
```bash
npm install
npm run dev
```

App will be running on 👉 http://localhost:3000
