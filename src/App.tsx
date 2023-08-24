import { Form, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from "react";
import "./style/app.css";
import Activity from "./interface/todoFormInterface";
import Done from "./enum/done";
import { MdDone, MdRemoveDone, MdRemove, MdModeEdit } from "react-icons/md";
import { ToastContainer, toast } from 'react-toastify';

function App() {
  const [form, setForm] = useState<Activity>({
    title: "",
    isDone: Done.unDone,
  });
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filter, setFilter] = useState("");
  const [editStates, setEditStates] = useState<boolean[]>([]);
  const [formValidation,setFormValidator]=useState<boolean>(false)
  const handleSubmit = () => {
    if(form.title.length!==0){
      setActivities([...activities, form]);
      setForm({ title: "", isDone: Done.unDone });
    }else{
      toast.warning('Empty Todo! Type Something')
    }
  };
  const handleSetDoneUndone = (idx: number) => {
    setActivities((prev) =>
      prev.map((act, i) =>
        i === idx
        ? {
              ...act,
              isDone: act.isDone === Done.Done ? Done.unDone : Done.Done,
            }
          : act
      )
      );
  };
  const handleDeleteTodo = (idx: number) => {
    setActivities((prev) => prev.filter((_, i) => i !== idx));
  };
  const handleSetEdit = (idx: number) => {
    setEditStates((prev) =>
      prev.map((state, i) => (i === idx ? !state : state))
    );
  };
  const classNameSelector=(activity:Activity)=>
  activity.isDone === Done.Done
  ? "done-activity"
  : "undone-activity"

  useEffect(() => {
    const savedTodos = localStorage.getItem("todos");
    if (savedTodos) {
      const parsedTodos = JSON.parse(savedTodos);
      setActivities(parsedTodos);
      setEditStates(new Array(parsedTodos.length).fill(false));
    }
  }, []);
    useEffect(() => {
      localStorage.setItem("todos", JSON.stringify(activities));
    }, [activities]);

  return (
    <>
    <div className="container mt-4">
      <h1 className="d-flex justify-content-center">Todo</h1>
      <Form onSubmit={handleSubmit}>
        <div className="d-flex">
          <Form.Control
            placeholder="title"
            type="text"
            onChange={(e) => {
                setForm({ ...form, title: e.target.value })
                if (e.target.value.length >= 1) {
                  setFormValidator(true); 
                }
            }}
            value={form.title}
            isInvalid={formValidation && form.title?.length === 0} 
            isValid={formValidation && form.title?.length > 0}
          />
        </div>
        <Button type="submit" variant="primary">
          Add Todo
        </Button>
      </Form>
      <div className="project-list mt-4">
        {activities.length > 0 && (
          <Form.Select
            defaultValue={""}
            onChange={(e) => {
              setFilter(e.target.value);
            }}
          >
            <option value="">Show All {filter === "" ? "SELECTED" : ""}</option>
            <option value="unDone">
              Unfinished {filter === "unDone" ? "SELECTED" : ""}
            </option>
            <option value="Done">
              Finished {filter === "Done" ? "SELECTED" : ""}
            </option>
          </Form.Select>
        )}
        {activities.map((activity, idx) =>
          filter === "" ||
          (filter === "unDone" && activity.isDone === Done.unDone) ||
          (filter === "Done" && activity.isDone === Done.Done) ? (
            <div
              key={idx}
              className={`activity-item ${classNameSelector(activity)} d-flex justify-content-between align-items-center todo-item`}
            >
              
                  {editStates[idx] ? (
                    <Form.Group>
                      <Form.Control
                      className={classNameSelector(activity)}
                      value={activity.title}
                      onChange={(e) => {
                        setActivities((prev) =>
                          prev.map((act, i) =>
                            i === idx
                              ? {
                                  ...act,
                                  title: e.target.value,
                                }
                              : act
                          )
                        );
                      }}
                    />
                    </Form.Group>
                  ) : (
                    <span className="d-flex gap-5 align-items-center">
                    {activity.title}
                  </span>
                  )}
                <div className="d-flex">
                  <Button
                    variant={
                      activity.isDone === Done.Done ? "warning" : "success"
                    }
                    onClick={() => handleSetDoneUndone(idx)}
                  >
                    {activity.isDone === Done.unDone ? (
                      <MdDone />
                    ) : (
                      <MdRemoveDone />
                    )}
                  </Button>{" "}
                  <Button onClick={() => handleDeleteTodo(idx)}>
                    <MdRemove />
                  </Button>
                  <Button variant="info" onClick={() => handleSetEdit(idx)}>
                  {editStates[idx]!=true?<MdModeEdit />:"Modify"}
               </Button>
                </div>
            </div>
          ) : null
        )}
      </div>
    </div>
    <ToastContainer/>
    </>
  );
}

export default App;
