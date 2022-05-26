## Step 1 : How To Clone Project

```bash
git clone --branch dev https://github.com/newbizstartkorea/mdbk_front_sanjay.git
```

## Step 2 : If Typescript Not Install In Your Server Then Please Run Below Command

```bash
npm install -g typescript
npm install -g ts-node
```

## Step 3 : How To Install Third Party Packages

```bash
npm run install
or
yarn
```

## Step 4 : Change Backend Project Domain in `\constants\api.tsx`

```bash
export const BASE_URL = `https://example_of_backend_project_domain.com`
```

## Step 5 : Change Admin Project Domain in `\next-i18next.config.js`

```bash
module.exports = {
    i18n: {
        localeDetection: true,
        defaultLocale: 'kr',
        locales: ['en', 'kr'],
        domains: [
            {
                domain: 'example_of_admin_project_domain.com',
                defaultLocale: 'kr',
                http: true,
            }
        ]
    }
}
```

## Step 6 : How To Create Project Build

```bash
npm run build
or
yarn build
```

## Step 7 : How To Run Project

```bash
npm run start
or
yarn start
```
