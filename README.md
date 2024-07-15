![hero](https://xata.io/_next/image?url=%2Fmdx%2Fdocs%2Fmdx-blog%2Fpxci-hackathon%402x.jpg&w=3840&q=75)

# That Rundown

Easily summarize youtube videos with the power of AI. Get valuable insights in to your favourite content and increase productitivity.

![gif](https://i.makeagif.com/media/6-16-2021/ldSzfr.gif)

## Installation

Install and run the extension in your favorite chromium browser

#### Chromium based

Hit the link to download the extension

[DOWNLOAD FOR CHROME](https://utfs.io/f/dd2c6c4d-c242-45a6-b397-3e3aad04c2c6-1jyp8g.crx)

And then drag and drop the downloaded file to your extensions page via:

```bash
 chrome://extensions
```

#### Other browsers not supported yet

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
