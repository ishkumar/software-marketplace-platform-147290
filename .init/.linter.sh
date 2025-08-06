#!/bin/bash
cd /home/kavia/workspace/code-generation/software-marketplace-platform-147290/marketplace_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

