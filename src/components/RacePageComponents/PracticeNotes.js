import React, { useState } from 'react';
import { ActionButton, Col, Row, Textarea } from "../../SharedStyles";
import { useSelector, useStore } from "react-redux";
import styled from "styled-components";
import fire from "../../fire";

const Note = styled.p`
	color: #774d2b;
	margin-bottom: 0px;
`;
const NoteTextarea = styled(Textarea)`
	color: #784d2b;
`;

const AddNoteButton = styled(ActionButton)`
    margin: 0 10px 10px 0;
`;

const NoteArea = styled(Col)`
    align-items: center;
`;

const NoteAreaTitle = styled.span`
    color: #784d2b;
	text-align: center;
	text-transform: uppercase;
    font-weight: 800;
`;

const Paragraphs = styled.div`
	border-bottom: 10px solid #fde3a6;
	margin-bottom: 10px;
	padding: 5px;
	width: 100%;
`;

const PracticeNotes = ({...otherProps}) => {

    const store = useStore();
    const storeState = store.getState();
    const user = storeState.user;

    const race = useSelector(storeState => {
        return (
            storeState.races.find(race => {
                return race.id === otherProps.raceId
            })
        )
    });

    const [addPracticeNoteMode, setAddPracticeNoteMode] = useState(false);
    const [addNoteInputValue, setAddNoteInputValue] = useState('');
    const [editPracticeMode, setEditPracticeMode] = useState(false);

    const inputValuesChange = (event) => {
        setAddNoteInputValue(event.target.value);
    };

    const onAddPracticeNote = () => {
        if (!addPracticeNoteMode) {
            setAddPracticeNoteMode(true);
            setAddNoteInputValue('');
        } else {
            setAddPracticeNoteMode(false);
            setAddNoteInputValue('');
        }
    };

    let practiceNotes;
    if (race.practiceNotes) {
        practiceNotes = race.practiceNotes.map((elem, index) => {
            return (
                <Note key={index}>
                    {elem}
                </Note>
            )
        });
    }

    let practiceNotesEditing;
    if (race.practiceNotes) {
        practiceNotesEditing = race.practiceNotes.map((elem, index) => {
            return (
                <textarea key={index} defaultValue={elem}/>
            )
        });
    }

    const onEditPracticeNote = () => {
        setEditPracticeMode(!editPracticeMode);
    };

    const addPracticeNoteButton = (
        <AddNoteButton
            onClick={onAddPracticeNote}>
            {!addPracticeNoteMode ? "Add Note" : "Hide"}
        </AddNoteButton>
    );

    const addEditPracticeNoteButton = (
        <AddNoteButton
            onClick={onEditPracticeNote}>
            {!editPracticeMode ? "Edit" : "Submit"}
        </AddNoteButton>
    );

    const practiceNotesDisplayNode = (
        (race.practiceNotes && race.practiceNotes.length) ? practiceNotes : <Note>{'No Data'}</Note>
    );

    const onAddNote = () => {
        if (!addNoteInputValue) {
            return;
        }

        const raceReference = fire.firestore().collection("races").doc(race.id);
        const note = 'practiceNotes';
        const previousNotes = race['practiceNotes'] || null;

        raceReference.update({
            [note]: previousNotes ? [...race['practiceNotes'], addNoteInputValue] : [addNoteInputValue]
        })
            .then(function () {
                console.log("Document successfully updated!");

            })
            .catch(function (error) {
                // The document probably doesn't exist.
                console.error("Error updating document: ", error);
            });
        setAddNoteInputValue('');
    };

    const addNoteForm = (
        <>
            <NoteTextarea
                className="form-control"
                placeholder={''}
                type="text"
                rows="3"
                value={addNoteInputValue}
                onChange={inputValuesChange}
                required>
            </NoteTextarea>
            <ActionButton
                onClick={onAddNote}>
                {"Add"}
            </ActionButton>
        </>
    );

    return (
        <NoteArea>
            <NoteAreaTitle>Practice</NoteAreaTitle>
            <Paragraphs>
                {editPracticeMode ? practiceNotesEditing : practiceNotesDisplayNode}
            </Paragraphs>
            <Row>
                {user.length === 0 ? "" : addPracticeNoteButton}
                {user.length === 0 ? "" : addEditPracticeNoteButton}
            </Row>
            {!addPracticeNoteMode ? "" : addNoteForm}
        </NoteArea>
    )
};

export default PracticeNotes;
