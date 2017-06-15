#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const questions = require("@unumux/ux-questions");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        // if this isn't macOS, exit
        if (process.platform !== "darwin") {
            console.log("This tool only works on macOS!");
            process.exit();
        }
        // ask the user which side the spacers should be added to
        const side = yield questions.list("Which side should the spacer be added to?", ["Left", "Right"]);
        // ask the user how many spacers to create
        const numberOfSpacersInput = yield questions.text("How many dock spacers would you like to create?", "1");
        const numberOfSpacers = parseInt(numberOfSpacersInput);
        // if numberOfSpacers is not a valid number, exit
        if (!numberOfSpacers) {
            console.log("You must enter a number!");
            process.exit();
        }
        // run the createSpacer function {numberOfSpacers} times
        for (let i = 0; i < numberOfSpacers; i++) {
            yield createSpacer(side);
        }
        // restart the dock process
        restartDock();
    });
}
function createSpacer(side) {
    const dockArea = side === "Left" ? "persistent-apps" : "persistent-others";
    const cmd = `defaults write com.apple.dock ${dockArea} -array-add '{tile-data={}; tile-type="spacer-tile";}'`;
    // promisify our exec cmd
    return new Promise((resolve, reject) => {
        child_process_1.exec(cmd, (err, stdout) => {
            if (err) {
                return reject(err);
            }
            resolve(stdout);
        });
    });
}
function restartDock() {
    child_process_1.exec(`killall Dock`);
}
main();
