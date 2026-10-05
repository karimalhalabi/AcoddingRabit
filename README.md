# Tarteeb · A place for every class

A bilingual React 19.3 scheduling application, with a persistent Express/SQLite backend, editable room timetables, and formatted Excel import/export.

## Run locally

Requires Node **24+** and npm. The `.npmrc` enables legacy peer resolution for the optional React Scripts 5 compatibility toolchain.

```sh
npm ci
npm start                 # API :3001 + Vite :5173
```

Other commands:

```sh
npm run dev               # same services with API file watching
npm run start:vite        # Vite development mode
npm run start:react-scripts # API :3001 + React Scripts frontend :5173
npm start -- --react-scripts # equivalent React Scripts mode through npm start
npm run build             # Vite production output in dist/
npm run build:react-scripts # React Scripts production output in build/
npm test                  # scheduling, Excel, and isolated API integration tests
npm run sample            # regenerate both example Excel workbooks
```

Start one frontend mode at a time. The frontend proxies `/api` to port 3001. Both startup commands launch the API automatically. `API_PORT` can change the backend port, but the frontend proxy configuration must then match. `DATA_DIR` changes the database directory (default `.data/`). No external service credentials are needed.

For deployment, serve `dist/` (or `build/`) and reverse proxy `/api` to the Node server on the same origin. Run `node server/index.js` for the API. Use HTTPS and `COOKIE_SECURE=true` for secure session cookies. Set `APP_ORIGINS` to the exact public frontend origin (comma-separated if more than one); it defaults to local development on port 5173. This allows same-origin frontend requests through proxies that rewrite Host without trusting arbitrary forwarded headers. Keep `.data/` on persistent storage and back it up. The included setup is a single-instance application, without email verification or password recovery.

## Workflow

1. **Overview** starts with a clearly synthetic sample: 1,500 students, 24 teachers, 10 classrooms, 5 laboratories, and 92 sessions. No credentials needed to explore.
2. **Create schedule** configures the term, teaching/exam mode, student count, rooms, and capacities.
3. Upload the **8-column teacher workbook**, or edit teachers manually. The requested fields total eight columns (not seven): Teacher Name, Subject, Fulltime, Saturday, Sunday, Monday, Tuesday, Wednesday. Values are Yes/No. Header names remain English in either interface language for interoperability.
4. Adjust availability, classroom/laboratory requirements, and sessions per week. Full-time status is descriptive; explicit day checkboxes always control scheduling. Part-time and special circumstances are handled by these checkboxes. Thursday must be enabled explicitly for exams.
5. Review the actual **subjects per student group**. The demonstration starts with two subjects per group and includes all 24 teachers; it does not assume every student takes every subject. Groups are created automatically up to classroom capacity, with a smaller final group where needed. Their sizes sum to the entered total. A button assigns all subjects to all groups if required.
6. Confirm and generate. Choose rooms in the sidebar; click a session to move it or unplace it, or an empty slot to place a pending session. Invalid changes are rejected. Subject/teacher/curriculum changes are made in Create schedule and then regenerated.
7. **Export Excel** produces day-colored room sheets, headings, and an editable `Sessions` sheet. **Edit a schedule** reimports that workbook after validation.
8. Arabic/English selection switches labels and document direction. Browser storage keeps the latest timetable; React context keeps the setup draft when navigating. Accounts allow explicit saving of up to 50 schedules to SQLite. Guest work is local to this browser.

## Included examples

- [Teacher workbook](public/samples/teachers-sample.xlsx)
- [Complete schedule workbook](public/samples/schedule-sample.xlsx)

For Excel edits, change `roomId` (`C1`–`C10`, `L1`–`L5` with default settings), `day` (English full day name), `period` (0, 1, 2), and `week` (1-based) in **Sessions**. `placed` is Yes/No. Keep all session identities and required course data intact. Room worksheets are formatted views, regenerated on export. The hidden `_Tarteeb` worksheet preserves teachers, settings, and group information for a lossless round trip. Only Tarteeb-exported workbooks can be reimported as schedules; arbitrary Excel timetable layouts are not parsed.

## Scheduling behavior and limits

- School days: Saturday–Wednesday. Periods: 09:00–11:00, 11:00–13:00, 13:00–15:00.
- Exams add Thursday and may span 1–8 weeks; each assigned subject has one exam per group or lab section. Weekly classes use the configured weekly session count.
- Laboratories split a group into sections of at most the lab capacity. Sections of a group are scheduled sequentially, conservatively avoiding all group overlaps.
- A bounded greedy heuristic prioritizes limited teacher availability and attempts five deterministic ordering variations. It checks teacher, group, and room conflicts, room kind, capacities, and dates. It does **not** prove optimality or infeasibility. Unplaced sessions are retained and shown explicitly; capacity limitations never produce silent omissions.
- The app does not invent program curricula, student-level enrollments, teacher hour limits beyond availability, holidays, prerequisites, or individual exam accommodations.
- Import supports plain `.xlsx` cells up to 5 MB. Formulas and rich text are rejected in data sheets. Human names and subjects stay as entered; only interface/export labels are translated.

## Structure

```text
src/
  components/   # shared UI; colocated camelCase CSS modules
  pages/        # Home, Setup, Import, About, Auth; separate CSS modules
  context/      # shared schedule, setup draft, language, account state
  util/         # scheduling, validation, data, API/storage, Excel helpers
server/         # Express API, SQLite persistence, scrypt passwords, sessions
scripts/        # dual toolchain launchers and sample generation
tests/          # meaningful scheduling, workbook, and API integration tests
public/samples/ # downloadable sample Excel files
```

Vite is the primary toolchain. React Scripts 5 is included because dual compatibility was requested; its older transitive dependencies have npm audit advisories. Use the Vite path for ongoing development and deployment. The legacy compatibility toolchain is an optional dependency. A deployment serving already-built assets and running only the API can install runtime dependencies with `npm ci --omit=dev --omit=optional`. Keep optional dependencies installed when building with Vite because its native build tools also use optional packages. ExcelJS is loaded on demand for workbook operations. A scoped uuid override avoids the production dependency advisory while retaining ExcelJS compatibility.
