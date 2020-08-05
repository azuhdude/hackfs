const { Command, requiredOption } = require('commander');
const program = new Command();

const { createPow } = require("@textile/powergate-client");

function create_upload_receipt() {

}

function write_upload_receipt() {

}

function upload_file_to_ffs() {

};

function find_file_and_read_file() {

}

function parse_list_of_files() {

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

    // format data address json
    // format data address json
    // write data_upload_reciept_train_data
    // write data_upload_receipt_test_data
}

function numerical_data_mode(args) {
    const power_gate_client = createPow({ args.parent.host })
    // upload train data csv
    // upload test data csv
    // save data address
    // save data address
    // format data address json
    // format data address json
    // write data_upload_reciept_train_data
    // write data_upload_receipt_test_data
}

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