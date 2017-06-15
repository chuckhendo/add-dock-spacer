#!/usr/bin/env node
"use strict";

import { exec } from "child_process";

import * as questions from "@unumux/ux-questions";

async function main() {
    // if this isn't macOS, exit
    if(process.platform !== "darwin") {
        console.log("This tool only works on macOS!");
        process.exit();
    }

    // ask the user how many spacers to create
    const numberOfSpacersInput: string = await questions.text("How many dock spacers would you like to create?", "1");
    const numberOfSpacers = parseInt(numberOfSpacersInput);

    // if numberOfSpacers is not a valid number, exit
    if(!numberOfSpacers) {
        console.log("You must enter a number!");
        process.exit();
    }

    // run the createSpacer function {numberOfSpacers} times
    for(let i = 0; i < numberOfSpacers; i++) {
        await createSpacer();
    }

    // restart the dock process
    restartDock();
}

function createSpacer() {
    const cmd = `defaults write com.apple.dock persistent-apps -array-add '{tile-data={}; tile-type="spacer-tile";}'`;

    // promisify our exec cmd
    return new Promise((resolve, reject) => {
         exec(cmd, (err, stdout) => {
             if(err) {
                 return reject(err);
             }

             resolve(stdout);
         });
    });
}

function restartDock() {
    exec(`killall Dock`);
}

main();