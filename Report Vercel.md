09:39:10.034 Running build in Washington, D.C., USA (East) – iad1
09:39:10.035 Build machine configuration: 2 cores, 8 GB
09:39:10.046 Cloning github.com/johngvicent/terranova (Branch: master, Commit: d9b1d3d)
09:39:10.047 Skipping build cache, deployment was triggered without cache.
09:39:10.316 Cloning completed: 269.000ms
09:39:11.165 Running "vercel build"
09:39:11.897 Vercel CLI 51.6.1
09:39:12.336 Installing dependencies...
09:39:31.276 
09:39:31.276 added 487 packages in 19s
09:39:31.277 
09:39:31.277 166 packages are looking for funding
09:39:31.277   run `npm fund` for details
09:39:31.533 Detected Next.js version: 16.2.1
09:39:31.543 Running "npm run build"
09:39:31.708 
09:39:31.709 > terranova@0.1.0 build
09:39:31.709 > next build
09:39:31.710 
09:39:32.224   Applying modifyConfig from Vercel
09:39:32.230 Attention: Next.js now collects completely anonymous telemetry regarding usage.
09:39:32.230 This information is used to shape Next.js' roadmap and prioritize features.
09:39:32.231 You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:
09:39:32.231 https://nextjs.org/telemetry
09:39:32.231 
09:39:32.262 ▲ Next.js 16.2.1 (Turbopack)
09:39:32.263 
09:39:32.275 ⚠ The "middleware" file convention is deprecated. Please use "proxy" instead. Learn more: https://nextjs.org/docs/messages/middleware-to-proxy
09:39:32.300   Creating an optimized production build ...
09:39:44.795 
09:39:44.795 > Build error occurred
09:39:44.798 Error: Turbopack build failed with 1 errors:
09:39:44.799 ./src/lib/prisma.js:1:1
09:39:44.799 Module not found: Can't resolve '@/generated/prisma/client'
09:39:44.799 [31m[1m>[0m [90m1 |[0m [36mimport[0m { [33mPrismaClient[0m } [36mfrom[0m [32m"@/generated/prisma/client"[0m;
09:39:44.800   [90m  |[0m [31m[1m^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^[0m
09:39:44.800   [90m2 |[0m [36mimport[0m { [33mPrismaPg[0m } [36mfrom[0m [32m"@prisma/adapter-pg"[0m;
09:39:44.800   [90m3 |[0m
09:39:44.801   [90m4 |[0m [36mconst[0m globalForPrisma = globalThis;
09:39:44.801 
09:39:44.801 Import map: aliased to relative './src/generated/prisma/client' inside of [project]/
09:39:44.801 
09:39:44.801 
09:39:44.801 Import traces:
09:39:44.801   App Route:
09:39:44.801     ./src/lib/prisma.js
09:39:44.801     ./src/app/api/webhooks/whatsapp/route.js
09:39:44.801 
09:39:44.801   Server Component:
09:39:44.801     ./src/lib/prisma.js
09:39:44.802     ./src/lib/auth.js
09:39:44.802     ./src/app/admin/layout.js
09:39:44.802 
09:39:44.802 https://nextjs.org/docs/messages/module-not-found
09:39:44.802 
09:39:44.802 
09:39:44.802     at <unknown> (./src/lib/prisma.js:1:1)
09:39:44.802     at <unknown> (https://nextjs.org/docs/messages/module-not-found)
09:39:44.866 Error: Command "npm run build" exited with 1