import React, {useEffect, useReducer, useRef, useState} from 'react';
import {useHistory} from 'react-router-dom';

import reducer, {initialState} from '../../store/reducer';
import {
    setTodos,
    createTodo,
    deleteTodo,
    toggleAllTodos,
    deleteAllTodos,
    updateTodoStatus
} from '../../store/actions';
import Service from '../../service';
import {TodoStatus} from '../../models/todo';
import {isTodoCompleted} from '../../utils';

import ButtonBase from '../../components/atoms/ButtonBase';

type EnhanceTodoStatus = TodoStatus | 'ALL';


const ToDo = () => {
    const [{todos}, dispatch] = useReducer(reducer, initialState);
    const [showing, setShowing] = useState<EnhanceTodoStatus>('ALL');
    const inputRef = useRef<HTMLInputElement>(null);
    const history = useHistory()
    useEffect(()=>{
        (async ()=>{
            const resp = await Service.getTodos();
            dispatch(setTodos(resp || []));
        })()
    }, [])

    const onCreateTodo = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && inputRef.current) {
            try {
                const resp = await Service.createTodo(inputRef.current.value);
                dispatch(createTodo(resp));
                inputRef.current.value = '';
            } catch (e) {
                if (e.response.status === 401) {
                    history.push('/login')
                }
            }
        }
    }

    const onUpdateTodoStatus = (e: React.ChangeEvent<HTMLInputElement>, todoId: string) => {
        dispatch(updateTodoStatus(todoId, e.target.checked))
    }

    const onToggleAllTodo = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(toggleAllTodos(e.target.checked))
    }

    const onDeleteAllTodo = () => {
        dispatch(deleteAllTodos());
    }

    const showTodos = todos.filter((todo) => {
        switch (showing) {
            case TodoStatus.ACTIVE:
                return todo.status === TodoStatus.ACTIVE;
            case TodoStatus.COMPLETED:
                return todo.status === TodoStatus.COMPLETED;
            default:
                return true;
        }
    });

    const activeTodos = todos.reduce(function (accum, todo) {
        return isTodoCompleted(todo) ? accum : accum + 1;
    }, 0);

    return (
        <div className="ToDo__container">
            <div className="Todo__creation">
                <input
                    ref={inputRef}
                    className="Todo__input"
                    placeholder="What need to be done?"
                    onKeyDown={onCreateTodo}
                />
            </div>
            <div className="ToDo__list">
                {
                    showTodos.map((todo, index) => {
                        return (
                            <div key={index} className="ToDo__item">
                                <input
                                    type="checkbox"
                                    checked={isTodoCompleted(todo)}
                                    onChange={(e) => onUpdateTodoStatus(e, todo.id)}
                                />
                                <span>{todo.content}</span>
                                <ButtonBase
                                    handleSubmit={() => dispatch(deleteTodo(todo.id))}
                                    text="X"
                                />
                            </div>
                        );
                    })
                }
            </div>
            <div className="Todo__toolbar">
                {todos.length > 0 ?
                    <input
                        type="checkbox"
                        checked={activeTodos === 0}
                        onChange={onToggleAllTodo}
                    /> : <div/>
                }
                <div className="Todo__tabs">
                    <ButtonBase bgColor="#2c3e50" textColor="#ecf0f1" handleSubmit={()=>setShowing('ALL')} text="All"/>
                    <ButtonBase bgColor="#2c3e50" textColor="#ecf0f1" handleSubmit={()=>setShowing(TodoStatus.ACTIVE)} text="Active"/>
                    <ButtonBase bgColor="#2c3e50" textColor="#ecf0f1" handleSubmit={()=>setShowing(TodoStatus.COMPLETED)} text="Completed"/>
                </div>
                <ButtonBase bgColor="#c0392b" handleSubmit={onDeleteAllTodo} text="Clear all todos"/>
            </div>
        </div>
    );
};

export default ToDo;