import fs from 'node:fs'
import {readFile} from 'node:fs/promises'
import { readdir } from 'node:fs/promises';

async function main() {
    createFolder()
    const { contentOfMD } = await getMarkdownData()
    await createJsonFile({ listOfMD: contentOfMD })
}

function createFolder() {
    const folderDir = './src/data'
    const existFolder = !fs.existsSync(folderDir)

    fs.mkdir(folderDir, { recursive:true }, (err) => {
        if (err) throw err
    })
    console.log("✨ Folder created")
    if(!existFolder) {
    }
}

async function getMarkdownData () {
    try {
        const pathFolderMD = './src/pages/es'
        const pathNamesMD = await readdir(pathFolderMD);

        const dataResult = await pathNamesMD.map(pathMD => readFile(`${pathFolderMD}/${pathMD}`, 'utf8'))
        const contentOfMD = await Promise.all(dataResult)

        console.log("✨ Markdown files readed")
        return {contentOfMD}
    } catch (err) {
        console.error(err);
    } 
}

/**
 * @param {Object} params
 * @param {Array<string>} params.listOfMD 
 */
async function createJsonFile({ listOfMD }) {
    const headersOfMD = listOfMD.map(md => md.split('---')[1].split(/\n/))
    const normalizedHeader = headersOfMD
    let jsonData = []

    const keyValueMD = normalizedHeader.map((keyValueStr) => {
      return keyValueStr.map(header => {
        if(header.trim() === '') return null
        return header.split(': ')
      })
    })

    keyValueMD.forEach((values) => {
      values.forEach(keyValue => {
        if(keyValue === null) return 
        jsonData = [
          ...jsonData,
          {
            [keyValue[0]]: keyValue[1]
          }
        ]
      })
    })

  console.log('✨ JSON data created')

  const fileName = './src/data/data.json'
    
  fs.writeFile(fileName, JSON.stringify(jsonData), 'utf-8', (err) => {
      if (err) throw err
  })

  console.log("✨ JSON file created")

  return {
    jsonData
  }
}

(async () => {
    await main()
})()