![hero](https://xata.io/_next/image?url=%2Fmdx%2Fdocs%2Fmdx-blog%2Fpxci-hackathon%402x.jpg&w=3840&q=75)

# That Rundown

Easily summarize youtube videos with the power of AI. Get valuable insights in to your favourite content and increase productitivity.

![gif](https://i.makeagif.com/media/6-16-2021/ldSzfr.gif)

## Installation

Install and run the extension in your favorite chromium browser

#### Chromium based

Hit the link to download the extension (Ive somehow managed to get it approved on the chrome store within a week.. must be a worlds first... 😅)

[DOWNLOAD FOR CHROME](https://chromewebstore.google.com/detail/thatrundown-%F0%9F%91%A8%F0%9F%8F%BB%E2%80%8D%F0%9F%92%BC/nlglhmlpmhinfajbeojonppplopckbmp?authuser=0&hl=en-GB)

> [!WARNING]
> If this fails, please get the latest ZIP file from the most recent action and drag n drop this in to the extensions page.
> [Found here](https://github.com/iammorganparry/thatrundown/actions)

Youll know if somethings up if you see this..

![error-image](https://i.imgur.com/jA5pLi0.png)

If you do.. use the zip file install instead

#### Other browsers not supported yet

## How to use..

1. Install the extension via the chrome store above
2. You should be redirected to youtube to start getting some rundowns!
3. Login to the application via page button or slide out
4. Request a summary!
5. Wait a few mins for the magic to happen
6. Profit???
7. You can view your rundown once complete and also chat with it!

## Key Features

### 🔐 Clerk Authentication

Using clerk to secure the api and frontend applications

### 💨 Inngest

Using inngest to manage AI workflows and queuing

### 🦋 Xata.io

Using Xata to store all the goods

### ⎐ Prisma

Using prisma to talk to xata and make my life easy

### Other mentions

Shoutout to ytdl for making the youtube extraction easier, Plasmo for actually solving chrome extensions.. t3 for being t3

## Run Locally

Clone the project

```bash
  git clone https://link-to-project
```

Install Turbo globally

```bash
  npm install -g turbo
```

Go to the project directory

```bash
  cd my-project
```

Install dependencies

```bash
  yarn install
```

Start the server

```bash
  yarn dev
```

Drag the dev build of the extension in `apps/extension/build` to your extensions page in a chromium based browser.

Get all required ENV vars in the `.env.example` and move to `.env`

## Tech Stack

**Client:** [Plasmo](https://www.plasmo.com/), [tRpc](https://trpc.io/), [Clerk](https://clerk.dev/), [MUI](mui.com), [ai](https://sdk.vercel.ai/docs/introduction),

**Server:** [Inngest](https://www.inngest.com/), [Clerk](https://clerk.dev/), [Xata](https://xata.io/), [Prisma](prisma.io),[Pusher](https://pusher.com/), [Hono](https://hono.dev/), [tRpc](https://trpc.io/), [LangChain](langchain.com),[uploadthing](https://uploadthing.com/), [zod](https://zod.dev/), [ai](https://sdk.vercel.ai/docs/introduction)
