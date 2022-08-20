import { Typography, Input, Space, Form, Button, message } from "antd";
import { useEffect, useRef, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import "antd/dist/antd.css";

const { Title } = Typography;
const approvers = [
  {
    first: "d",
    last: "k"
  },
  {
    first: "b",
    last: "l"
  }
];

export default function Todo() {
  const [dndList, setDndList] = useState([]);
  const list = useRef();
  const data = useRef(approvers);

  useEffect(() => {
    setDndList(list.current);
  }, [data]);

  const handleAdd = async (add) => {
    await add();
    if (dndList.length > 0 || dndList.length === 0) {
      const newList = list.current.slice(-1).pop();
      setDndList([...dndList, newList]);
      return;
    }

    setDndList(list.current);
    // console.log("add", list.current);
  };
  const handleRemove = (name) => {
    // await remove(name);
    const newList = dndList.filter((item) => item.name !== name);
    console.log(newList);
    setDndList(newList);
    // console.log("remove", list.current);
  };
  // form methods
  const [form] = Form.useForm();

  const onFinish = (values) => {
    const newValues = values.users.filter((item) =>
      dndList.some((item2) => item.index === item2.name)
    );
    const orderBy = dndList.map((item, i) => {
      return item.name;
    });
    // console.log(orderBy);
    newValues.sort((a, b) => {
      return orderBy.indexOf(a.index) - orderBy.indexOf(b.index);
    });
    // console.log(newValues);

    const approverList = [...newValues];
    approverList.map((item, index) => {
      item.position = Number(index + 1);
      delete item.index;
      return item;
    });
    delete values.users;
    values.approverList = approverList;
    console.log({ submit: values });
  };

  // reorder fn
  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  // dragend fn
  const onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(
      dndList,
      result.source.index,
      result.destination.index
    );

    // console.log("items", items);
    setDndList(items);
  };

  return (
    <>
      <Title level={3}>Drag and drop (DND) test</Title>

      <Form form={form} onFinish={onFinish} style={{ padding: 8 }}>
        <Form.List name="users" initialValue={approvers}>
          {(fields, { add }) => {
            console.log("fields", fields);
            list.current = fields;
            console.log("map", dndList);
            return (
              <>
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="droppable">
                    {(provided, snapshot) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        // style={listStyle(snapshot.isDraggingOver)}
                      >
                        {dndList?.map(({ key, name, ...restField }, index) => (
                          <Draggable
                            key={`${name}-dnd`}
                            draggableId={`${name}-dnd`}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                // style={itemStyle(
                                //   snapshot.isDragging,
                                //   provided.draggableProps.style
                                // )}
                              >
                                <Space
                                  key={key}
                                  style={{
                                    display: "flex",
                                    marginBottom: 8
                                  }}
                                  align="baseline"
                                >
                                  <Form.Item
                                    {...restField}
                                    name={[name, "first"]}
                                    rules={[
                                      {
                                        required: true,
                                        message: "Missing first name"
                                      }
                                    ]}
                                  >
                                    <Input placeholder="First Name" />
                                  </Form.Item>
                                  <Form.Item
                                    {...restField}
                                    name={[name, "last"]}
                                    rules={[
                                      {
                                        required: true,
                                        message: "Missing last name"
                                      }
                                    ]}
                                  >
                                    <Input placeholder="Last Name" />
                                  </Form.Item>
                                  <Form.Item
                                    {...restField}
                                    name={[name, "index"]}
                                    initialValue={name}
                                  >
                                    <Input placeholder="Last Name" type="" />
                                  </Form.Item>
                                  <MinusCircleOutlined
                                    onClick={() => handleRemove(name)}
                                  />
                                </Space>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => handleAdd(add)}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add field
                  </Button>
                </Form.Item>
              </>
            );
          }}
        </Form.List>

        <Form.Item>
          <Button htmlType="submit" type="primary">
            Create Pipeline
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}
