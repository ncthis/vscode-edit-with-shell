
const ShellCommandService = require('../../lib/shell-command-service');

describe('ShellCommandService', () => {

    it('Runs a given command and collects the command output', () => {
        const childProcess = {
            spawn: sinon.stub().returns('COMMAND')
        };
        const processRunner = {
            run: sinon.stub().returns(Promise.resolve('COMMAND_OUTPUT'))
        };
        const getEnvVars = () => ({SOME_ENV_VAR: '...'});

        const service = new ShellCommandService({childProcess, getEnvVars, processRunner});
        return service.runCommand('COMMAND_STRING', 'SELECTED_TEXT').then(output => {
            expect(output).to.eql('COMMAND_OUTPUT');
            expect(childProcess.spawn).to.have.been.calledWith(
                'COMMAND_STRING',
                {
                    env: {SOME_ENV_VAR: '...'},
                    shell: true
                }
            );
            expect(processRunner.run).to.have.been.calledWith('COMMAND', 'SELECTED_TEXT');
        });
    });

    it('does not give an input to the command if no text is selected in the editor', () => {
        const childProcess = {
            spawn: sinon.stub().returns('COMMAND')
        };
        const processRunner = {
            run: sinon.stub().returns(Promise.resolve('COMMAND_OUTPUT'))
        };
        const getEnvVars = () => ({SOME_ENV_VAR: '...'});
        const service = new ShellCommandService({childProcess, getEnvVars, processRunner});
        return service.runCommand('COMMAND_STRING').then(output => {
            expect(output).to.eql('COMMAND_OUTPUT');
            expect(childProcess.spawn).to.have.been.calledWith(
                'COMMAND_STRING',
                {
                    env: {SOME_ENV_VAR: '...'},
                    shell: true
                }
            );
            expect(processRunner.run).to.have.been.calledWith('COMMAND');
        });
    });

    it('throws an error if command failed', () => {
        const childProcess = {
            spawn: sinon.stub().returns('COMMAND')
        };
        const processRunner = {
            run: sinon.stub().returns(Promise.reject(new Error('EXEC_ERROR')))
        };
        const getEnvVars = () => {};
        const service = new ShellCommandService({childProcess, getEnvVars, processRunner});
        return service.runCommand('COMMAND').then(
            throwError,
            e => {
                expect(e).to.be.an('error');
                expect(e.message).to.eql('EXEC_ERROR');
            }
        );
    });

});
