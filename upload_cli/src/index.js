const { Command } = require('commander');
const program = new Command();


program
    .command('file_data')
    .option('--train_data_list')
    .option('--test_data_list')
    .action(function (args) {
        console.log('file_data')
        console.log(args.traid_data_list)
        console.log(args.test_data_list)
    })
    

program
    .command('numerical_data')
    .option('--train_data_file')
    .option('--test_data_file')
    .action(function (args) {
        console.log('numerical_data')
        console.log(args.train_data_file)
        console.log(args.test_data_file)
    })