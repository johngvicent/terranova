10:08:56.987 Running build in Washington, D.C., USA (East) – iad1
10:08:56.988 Build machine configuration: 2 cores, 8 GB
10:08:57.092 Cloning github.com/johngvicent/terranova (Branch: master, Commit: 8be2bdb)
10:08:57.093 Previous build caches not available.
10:08:57.409 Cloning completed: 316.000ms
10:08:57.801 Running "vercel build"
10:08:58.518 Vercel CLI 51.6.1
10:08:58.801 Installing dependencies...
10:09:18.282 
10:09:18.283 > terranova@0.1.0 postinstall
10:09:18.283 > prisma generate
10:09:18.284 
10:09:19.225 Loaded Prisma config from prisma.config.ts.
10:09:19.226 
10:09:19.402 Prisma schema loaded from prisma/schema.prisma.
10:09:19.556 
10:09:19.557 ✔ Generated Prisma Client (7.6.0) to ./src/generated/prisma in 88ms
10:09:19.557 
10:09:19.587 
10:09:19.587 added 487 packages in 20s
10:09:19.587 
10:09:19.588 166 packages are looking for funding
10:09:19.588   run `npm fund` for details
10:09:19.691 Detected Next.js version: 16.2.1
10:09:19.698 Running "npm run build"
10:09:19.805 
10:09:19.806 > terranova@0.1.0 build
10:09:19.806 > prisma generate && next build
10:09:19.806 
10:09:20.567 Loaded Prisma config from prisma.config.ts.
10:09:20.568 
10:09:20.739 Prisma schema loaded from prisma/schema.prisma.
10:09:20.887 ┌─────────────────────────────────────────────────────────┐
10:09:20.888 │  Update available 7.6.0 -> 7.8.0                        │
10:09:20.888 │  Run the following to update                            │
10:09:20.888 │    npm i --save-dev prisma@latest                       │
10:09:20.888 │    npm i @prisma/client@latest                          │
10:09:20.888 └─────────────────────────────────────────────────────────┘
10:09:20.889 
10:09:20.889 ✔ Generated Prisma Client (7.6.0) to ./src/generated/prisma in 88ms
10:09:20.889 
10:09:21.395   Applying modifyConfig from Vercel
10:09:21.400 Attention: Next.js now collects completely anonymous telemetry regarding usage.
10:09:21.401 This information is used to shape Next.js' roadmap and prioritize features.
10:09:21.401 You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:
10:09:21.401 https://nextjs.org/telemetry
10:09:21.401 
10:09:21.433 ▲ Next.js 16.2.1 (Turbopack)
10:09:21.434 
10:09:21.465   Creating an optimized production build ...
10:09:32.761 ✓ Compiled successfully in 11.0s
10:09:32.766   Running TypeScript ...
10:09:32.918   Finished TypeScript in 147ms ...
10:09:32.921   Collecting page data using 1 worker ...
10:09:33.414 TypeError: Cannot read properties of undefined (reading 'startsWith')
10:09:33.415     at <unknown> (.next/server/chunks/[root-of-the-server]__0bzy5ma._.js:1:126538)
10:09:33.415     at <unknown> (.next/server/chunks/[root-of-the-server]__0bzy5ma._.js:1:126691)
10:09:33.920 
10:09:33.921 > Build error occurred
10:09:33.923 Error: Failed to collect page data for /api/leads/[id]
10:09:33.923     at ignore-listed frames {
10:09:33.924   type: 'Error'
10:09:33.924 }
10:09:33.988 Error: Command "npm run build" exited with 1