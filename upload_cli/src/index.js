const { Command, requiredOption } = require('commander');
const program = new Command();


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