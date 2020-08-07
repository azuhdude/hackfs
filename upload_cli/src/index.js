const { Command, requiredOption } = require('commander');
const fs = require("fs");
const { createPow } = require("@textile/powergate-client");
const { withOverride } = require('@textile/powergate-client/dist/ffs/options');

function write_upload_receipt(receipt, path, data_set_type) {
    receipt.data_set_type = data_set_type
    const write_data = JSON.stringify(receipt)
    fs.writeFileSync(path, write_data)
}

async function confirm_upload(power_gate, jobId) {
    const jobsCancel = power_gate.ffs.watchJobs((job) => {
        if (job.status === JobStatus.JOB_STATUS_CANCELED) {
          console.log("job canceled")
        } else if (job.status === JobStatus.JOB_STATUS_FAILED) {
          console.log("job failed")
        } else if (job.status === JobStatus.JOB_STATUS_SUCCESS) {
          console.log("job success!")
        }
      }, jobId)
}

async function upload_file_to_ffs(power_gate_client, file_path) {
    const file_buffer = fs.readFileSync(file_path)
    // add try catch for files that are already uploaded to ipfs and skip them
    const { cid } = await power_gate_client.ffs.stage(file_buffer)
    const { jobId}  = await power_gate_client.ffs.pushStorageConfig(cid, withOverride)
    // confirm_upload(power_gate_client,jobId)
    return {"file": file_path, "address": cid}
};

function parse_list_of_files() {

}

async function create_client(args){
    const host = args.parent.host
    var token = args.parent.key
    const power_gate_client = createPow({ host })
    if (!args.parent.key) {
        token = await power_gate_client.ffs.create()
        console.log("Your new token: " + token)
    }
    power_gate_client.setToken(token)
    return {power_gate_client, token}
}

function file_data_mode() {
    // parse train data list
    // for list of file
        // find file 
        // upload file
        // save data address

    // parse test data list
    // for list of file
        // find file
        // upload file
        // save data address

    // write data_upload_reciept_train_data
    // write data_upload_receipt_test_data
}

async function numerical_data_mode(args) {
    const power_gate = await create_client(args)

    const train_upload_reciept = await upload_file_to_ffs(power_gate.power_gate_client, args.train_data_file)
    const test_upload_reciept = await upload_file_to_ffs(power_gate.power_gate_client, args.test_data_file)

    write_upload_receipt(train_upload_reciept, "train_upload_reciept.json", "numeric")
    write_upload_receipt(test_upload_reciept, "test_upload_reciept.json", "numeric")
}

// numerical_data_mode({
//     "parent": {
//         "host": "http://0.0.0.0:6002",
//         "key": "29e4970e-45cc-4c69-a654-f5c1650022d8"
//     },
//     "train_data_file": "train_file.csv",
//     "test_data_file": "test_file.csv"
// })

const program = new Command();

const upload = program
    .command('upload')
    .requiredOption('--host <string>')
    .requiredOption('--key <string>') //Prob should just read an env var

upload
    .command('file_data')
    .requiredOption('--train_data_list <string>')
    .requiredOption('--test_data_list <string>')
    .action(function (args) {
        file_data_mode(args)
    })

upload
    .command('numerical_data')
    .requiredOption('--train_data_file <string>')
    .requiredOption('--test_data_file <string>')
    .action(function (args) {
        numerical_data_mode(args)   
    })


program.parse(process.argv)