This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

The API Collection is documented in this postman document : 

https://documenter.getpostman.com/view/29224684/2s9Ye8gEuq

## Getting Started

Set up .env file in root directory and add it as below :
POSTGRES_URL=**********
POSTGRES_PRISMA_URL=**********
POSTGRES_URL_NON_POOLING=**********
POSTGRES_USER=**********
POSTGRES_HOST=**********
POSTGRES_PASSWORD=**********
POSTGRES_DATABASE=**********

To run the app locally follow these steps in order :

1. npm i
2. npx prisma migrate dev --name init (Prisma will seed the connected database with the required tables)
3. npm run dev
4. You are good to go!

Notes on DB design : 

The database I chose for this project was Postgres, as it provides ACID transactions with Isolation Levels and is also a good fit for Structured Data.

The main query to mention about here would be the query for creating a Transaction. The idea is to implement an Isolation Level of REPEATBLE READ, to ensure when creating a Transaction, any other process creating a transaction on the same wallet will be locked out, until the first one commits or rollbacks. This ensures consistency in the database in case of concurrent requests, in exchange for performance. 


```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
