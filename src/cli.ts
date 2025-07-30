import { program } from "commander";
import * as fs from "fs";
import path from "path";
import { execSync } from "child_process";

program
  .argument("<project-name>", "name of the project")
  .description("Create a very simple NodeJs + TypeScript execution environment")
  .action((projectName: string) => {
    createProject(projectName);
  });

function createProject(projectName: string) {
  // ユーザーの現在のディレクトリと作成するプロジェクト名を結合
  const projectPath = path.join(process.cwd(), projectName);

  // 指定のプロジェクトディレクトリが存在しているかチェック
  if (!fs.existsSync(projectPath)) {
    // ディレクトリがない場合には新規作成
    fs.mkdirSync(projectPath, { recursive: true });
  }

  // テンプレートファイルをコピー
  const templateFilePath = path.join(__dirname, "..", "template");
  copyTemplate(templateFilePath, projectPath, projectName);

  console.log("Project created successfully!");
  
  // npm installを実行
  console.log("\nInstalling dependencies...");
  try {
    execSync("npm install", {
      cwd: projectPath,
      stdio: "inherit"
    });
    console.log("\nDependencies installed successfully!");
    console.log(`\nTo get started:\n  cd ${projectName}\n  npm run dev`);
  } catch (error) {
    console.error("Failed to install dependencies. Please run 'npm install' manually.");
  }
}

function copyTemplate(
  templatePath: string,
  targetPath: string,
  projectName: string
) {
  const files = fs.readdirSync(templatePath);

  files.forEach((file) => {
    const templateFile = path.join(templatePath, file);
    // ファイル名に.templateが入っている場合には除去する
    const targetFileName = file.replace(".template", "");
    const targetFile = path.join(targetPath, targetFileName);

    if (fs.statSync(templateFile).isDirectory()) {
      fs.mkdirSync(targetFile, { recursive: true });
      copyTemplate(templateFile, targetFile, projectName);
    } else {
      let content = fs.readFileSync(templateFile, "utf8");

      // package.jsonの場合はプロジェクト名を置換
      if (targetFileName === "package.json") {
        content = content.replace("{{PROJECT_NAME}}", projectName);
      }

      fs.writeFileSync(targetFile, content);
    }
  });
}

program.parse();
