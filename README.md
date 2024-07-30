
# Contentstack App for Pushing Data to Google Sheets

This application allows you to POST data from a Contentstack Entry into a specified Google Sheets by adding the data to the next empty row. It does this by using the Google Service Account Email and Key that you generate in Google Console to authenticate against the Google Sheets API and receive a token. 

Additional resources are provided to expedite the process and can be found in the following directories:

* `/pages/api/sheets-app.js` for the main application API and local testing.
* `/functions/sheets-app.js` for Contentstack Launch for the Cloud Function.
* `/data` for the Sheets template and Dummy Data for testing `.csv` files.
* `/content-model` for the Ad Campaign Content Model JSON schema.




## Disclaimer

The code provided herein is intended solely for demonstration and proof-of-concept purposes. It is NOT intended for production use, nor should it be used in any environment or application where its failure or misbehavior could lead to direct or indirect harm, loss, or damage.

Users are strongly advised to thoroughly review, test, and, if necessary, modify the code before considering its use in any real-world or production scenario.

By using or implementing this code, you acknowledge and accept all risks associated with its use and agree to hold harmless the author(s) or provider(s) from any and all claims, damages, or liabilities.

This app is Next.js powered app that can be used along with the Solution Guide "Pushing Data to Google Sheets with Contentstack"



## Getting Started HERE

Fork this repository, clone it locally, and connect to the remote repository you have forked.

Install the packages:

```bash
npm insall
```

Run the development server:

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

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/sheets-app). This endpoint can be edited in `pages/api/sheets-app.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!


