const { Command, requiredOption } = require('commander');
const program = new Command();

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

function numerical_data_mode() {
    // upload train data csv
    // upload test data csv
    // save data address
    // save data address
    // format data address json
    // format data address json
    // write data_upload_reciept_train_data
    // write data_upload_receipt_test_data
}

program
    .command('upload')
    .command('file_data')
    .requiredOption('--train_data_list <string>')
    .requiredOption('--test_data_list <string>')
    .action(function (args) {
        console.log('file_data')
        console.log(args.train_data_list)
        console.log(args.test_data_list)
    })
    

program
    .command('numerical_data')
    .requiredOption('--train_data_file <string>')
    .requiredOption('--test_data_file <string>')
    .action(function (args) {
        console.log('numerical_data')
        console.log(args.train_data_file)
        console.log(args.test_data_file)
    })


program.parse(process.argv)