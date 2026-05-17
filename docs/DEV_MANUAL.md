# Developer Manual

## How to Install and Run Locally
To run Job Checker locally, first clone the repository however you choose (e.g. `git clone git@github.com:rwang133/inst377-final-project.git` for SSH).

Next, make sure you have node installed. This can be done by running
`nvm install node`
in a MacOS terminal or PowerShell.

If nvm is not installed, use [this guide](https://www.freecodecamp.org/news/node-version-manager-nvm-install-guide/) to install it.

You can verify the installations by running
`nvm -v` and `node -v`.

After you've installed node, run
`npm i @supabase/supabase-js body-parser express nodemon`
to install the dependencies.

You will also need to make an account on [Supabase](https://supabase.com/) and [Logo.dev](https://www.logo.dev/) for the next steps.

Once you've logged into Supabase, create a new project and fill in the organization details as you please. Make sure that RLS is **disabled**. Next, go to the Table Editor using the navigation bar on the left side of the screen. Create a new table named "savedJobs" with these column names, using varchar as the data type:
userEmail
jobTitle
companyName
companyDomain
logoURL
jobDesc
flagged.

Although not good for security, if you want the app to work, you may also have to go to the SQL editor using the same navigation bar and run
```
    GRANT ALL PRIVILEGES
    ON TABLE public."savedJobs"
    TO anon, authenticated;
```
Once you're done with that, click the Connect button at the top of the Supabase dashboard. Scroll to the bottom of the side bar that pops up and you should have the URL and key for the next steps.

Create a .env file in the app folder and paste
```
SUPABASE_URL = ${YOUR_SUPABASE_URL}
SUPABASE_KEY = ${YOUR_SUPABASE_KEY}
LOGO_DEV_SECRET_KEY = ${YOUR_LOGO_DEV_SECRET_KEY}
```
into it, replacing the indicated variables with your stuff. The Logo.dev key can be found [here](https://www.logo.dev/dashboard/api-keys) after you log in.

Now that you have all the dependencies installed and environment variables ready, you can run
`npm start`
in the terminal to start the application. Use CTRL + C to quit.

## Testing the App
There are no particular tests for this app, though you can use [Insomnia](https://insomnia.rest/) to test whether the get/post functions are working, such as by sending sample JSON to the database to check if it stores correctly. The app will also log errors with get/post in the terminal or browser console.

## API Endpoints
Here are the API endpoints for this project and their uses
1. app.post(/savedJobs) => Write data to the database
2. app.get(/savedJobs) => Retrieve data from the database for the Saved Jobs page
3. app.get(/assessJob) => Retrieve data from Logo.dev for the Assess Job page
4. app.get('/') => Retrieve data for the homepage

## Known Bugs and Future Development
The main bug that I ran into while making this was getting permissions denied while trying to insert records into the Saved Jobs table. The workaround is described in the How to Install and Run Locally section.

For future development, the Saved Jobs table can have a login page where a user inputs their email and password to get only the data associated with their account. In addition, the Mailboxlayer API can be integrated to flag anything suspicious about company/HR contact emails listed in job posts. Lastly, the job details form can take in the company's address and return a link to a Google Maps search so the user can investigate reviews.
