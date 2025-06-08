This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

To deploy this weather application to Vercel, follow these steps:

1.  **Push your project to a Git repository:**

    - Ensure your project is a Git repository. If not, initialize one:
      ```bash
      git init
      git add .
      git commit -m "Initial commit"
      ```
    - Create a new repository on a platform like [GitHub](https://github.com/new), [GitLab](https://gitlab.com/projects/new), or [Bitbucket](https://bitbucket.org/repo/create).
    - Follow the instructions from your Git provider to push your local repository to the remote. For example, for GitHub:
      ```bash
      git remote add origin <your-repository-url>
      git branch -M main
      git push -u origin main
      ```

2.  **Import your project in Vercel:**

    - Go to your [Vercel dashboard](https://vercel.com/dashboard).
    - Click on "Add New..." and then "Project".
    - Import the Git repository you just pushed. Vercel will usually detect that it's a Next.js project.

3.  **Configure Environment Variables:**

    - This application requires an API key for WeatherAPI.com. You need to set this up in your Vercel project settings.
    - In your Vercel project dashboard, go to "Settings" -> "Environment Variables".
    - Add a new environment variable:
      - **Name:** `NEXT_PUBLIC_WEATHERAPI_KEY`
      - **Value:** Your WeatherAPI.com API key (e.g., `eefe2a7a551c411687931752250806` or your personal key).
    - Ensure you select all environments (Production, Preview, Development) for this variable to be available during the build process and at runtime.

4.  **Deploy:**
    - After configuring the environment variable, Vercel will typically trigger a new deployment automatically. If not, you can manually trigger one from the "Deployments" tab.
    - Vercel will build your Next.js application and deploy it. You'll get a unique URL for your live application.

For more general information on deploying Next.js applications, refer to the [official Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).
