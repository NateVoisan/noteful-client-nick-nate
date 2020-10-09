import React from 'react';
import config from '../config'
import ApiContext from '../ApiContext'
import ValidationError from '../ValidationError/ValidationError';
import './AddNote.css';


class AddNote extends React.Component {
    state = {
        name: {
            value: '',
            touched: false
        },
        folder: {
            value: '',
            touched: false
        },
        content: {
            value: '',
            touched: false
        },
        fetchError: '',
    }

    updateName = (name) => {
        this.setState({ name: { value: name, touched: true } });
    }

    updateFolder = (folder) => {
        this.setState({ folder: { value: folder, touched: true } });
    }

    updateContent = (content) => {
        this.setState({ content: { value: content, touched: true } });
    }

    validateName = () => {
        const name = this.state.name.value.trim();
        if (!name)
            return 'Name cannot be empty.'
        return;
    }

    validateFolder = (contextfolders) => {
        const folder = this.state.folder.value.trim();
        if (!folder)
            return 'Folder cannot be empty.'
        if (!contextfolders.find(contextfolder => contextfolder.id === folder))
            return 'Folder must be one of the available folders.'
        return;
    }

    validateContent = () => {
        const content = this.state.content.value.trim();
        if (!content)
            return 'Content cannot be empty.'
        return;
    }

    putNote = () => {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "name": this.state.name.value,
                "content": this.state.content.value,
                "folderId": this.state.folder.value
            })
        }
        return fetch(`${config.API_ENDPOINT}/notes`, options)
            .then(res => {
                if (!res.ok) throw new Error(res.statusText);
                return res.json();
            })
    }

    handleSubmit = (event, callback) => {
        event.preventDefault();
        this.setState({ fetchError: '' })
        this.putNote()
            .then((resJson) => {
                callback(resJson);
                this.props.history.push('/');
            })
            .catch(e => this.setState({ fetchError: e.message }));
    }

    createOption = (folders) => {
        const folderOption = folders.map(folder => {
            return (
                <option key={folder.id} value={folder.id}>{folder.name}</option>
            )
        });
        return folderOption;
    }

    render() {
        return (
            <ApiContext.Consumer>
                {(context) => (
                    <li className="add-note">
                        <form id='add-note-form'>
                            <p className='form-status'>{this.state.fetchError}</p>
                            <p className='form-title'>Add Note</p>
                            <label htmlFor='note-name'>Enter a note name:</label>
                            <p className='hint'>* required</p>
                            <div className="name-div">
                            <input
                                type='text'
                                id='note-name'
                                name='note-name'
                                onChange={(e) => this.updateName(e.target.value)}
                            />
                            {this.state.name.touched
                                && <ValidationError message={this.validateName()}/>}
                            </div>
                            <label htmlFor='note-content'>Content:</label>
                            <div className="content-textarea">
                            <textarea
                                rows="4" cols="49"
                                id='note-content'
                                name='note-content'
                                onChange={(e) => this.updateContent(e.target.value)}
                            />
                            {this.state.content.touched
                                && <ValidationError message={this.validateContent()}/>}
                            </div>
                            <label htmlFor='note-folder'>Folder:</label>
                            <select
                                id="folder-select"
                                name="folder-select"
                                defaultValue=''
                                onChange={(e) => this.updateFolder(e.target.value)}>
                                <option value='' disabled >Select a Folder:</option>
                                {this.createOption(context.folders)}
                            </select>
                            {this.state.folder.touched
                                && <ValidationError message={this.validateFolder(context.folders)}/>}
                            <div className="submit-button">
                                <button
                                    type='submit'
                                    form='add-folder-form'
                                    onClick={(e) => {
                                        this.handleSubmit(e, context.addNote)
                                    }}
                                    disabled={
                                        this.validateName() ||
                                        this.validateContent() ||
                                        this.validateFolder(context.folders)}
                                > Submit
                            </button>
                            </div>
                        </form>
                    </li>
                )}
            </ApiContext.Consumer>
        )
    }
}

export default AddNote;