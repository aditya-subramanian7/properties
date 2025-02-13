Run "npm run install", if it does not work run : "npm run install --force"

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


I have gone for a rather simple design choice using basic cards and button styles and daisy ui 
This is more focused on functionality rather than aesthetics 
The search function suggests properties based on the search query and the highlights the property both on list and 
on the map
Editing the location refreshes and the updates the map and the db respectively adding an updtaed location on there.