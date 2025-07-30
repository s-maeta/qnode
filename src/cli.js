"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const fs = __importStar(require("fs"));
const path_1 = __importDefault(require("path"));
commander_1.program
    .argument("<project-name>", "name of the project")
    .description("Create a very simple NodeJs + TypeScript execution environment")
    .action((projectName) => {
    createProject(projectName);
});
function createProject(projectName) {
    // ユーザーの現在のディレクトリと作成するプロジェクト名を結合
    const projectPath = path_1.default.join(process.cwd(), projectName);
    // 指定のプロジェクトディレクトリが存在しているかチェック
    if (fs.existsSync(projectPath)) {
        // ディレクトリがない場合には新規作成
        fs.mkdirSync(projectPath, { recursive: true });
    }
    // テンプレートファイルをコピー
    const templateFilePath = path_1.default.join(__dirname, "template");
    copyTemplate(templateFilePath, projectPath, projectName);
    console.log("Project created successfully!");
}
function copyTemplate(templatePath, targetPath, projectName) {
    const files = fs.readdirSync(templatePath).map((file) => {
        // ファイル名に.templateが入っている場合には除去する
        return file.replace(".template", "");
    });
    files.forEach((file) => {
        const templateFile = path_1.default.join(templatePath, file);
        const targetFile = path_1.default.join(targetPath, file);
        if (fs.statSync(templateFile).isDirectory()) {
            fs.mkdirSync(targetFile, { recursive: true });
            copyTemplate(templateFile, targetFile, projectName);
        }
        else {
            let content = fs.readFileSync(templateFile, "utf8");
            // package.jsonの場合はプロジェクト名を置換
            if (file === "package.json") {
                content = content.replace("{{PROJECT_NAME}}", projectName);
            }
            fs.writeFileSync(targetFile, content);
        }
    });
}
commander_1.program.parse();
