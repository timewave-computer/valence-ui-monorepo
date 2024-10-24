import path from "path";
import fs from "fs";
const REPORTS_PATH = "src/app/admin/reports";
const reportsDirectory = path.join(process.cwd(), REPORTS_PATH);

const ReportsHome = () => {
  const reports = fs.readdirSync(reportsDirectory);
  const reportsWithRoute: string[] = reports.filter((report) => {
    const routePath = path.join(reportsDirectory, report, "route.ts");
    return fs.existsSync(routePath);
  });

  return (
    <div className="flex grow flex-col bg-white px-4 py-8">
      <h1 className="text-2xl font-bold">Reports</h1>
      <p>See docs/reports.md for usage</p>
      <h2 className="pt-4 text-lg font-semibold">Available reports:</h2>
      <ul className="list-disc pl-4">
        {reportsWithRoute.map((report) => {
          return <li key={report}>{`/admin/reports/${report}`}</li>;
        })}
      </ul>
    </div>
  );
};

export default ReportsHome;
