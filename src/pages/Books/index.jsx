import {
  Col,
  Row,
  Typography,
  Card,
  Table,
  Divider,
  Form,
  Input,
  Button,
  message,
  Drawer,
} from "antd";
import { useEffect, useState } from "react";
import { getDataPrivate, sendDataPrivate } from "../../utils/api";

const { Title, Text } = Typography;

const Books = () => {
  const [dataSources, setDataSources] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingBookId, setEditingBookId] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    getBooks();
  }, []);

  const getBooks = () => {
    setIsLoading(true);
    getDataPrivate("/api/v1/books/read")
      .then((resp) => {
        setIsLoading(false);
        if (resp?.datas) {
          setDataSources(resp.datas);
        } else {
          setErrMsg("Can't fetch data");
        }
      })
      .catch((err) => {
        setIsLoading(false);
        setErrMsg("Data fetched failed");
        console.error(err);
      });
  };

  const handleEdit = (record) => {
    setEditMode(true);
    setEditingBookId(record.id_books);
    form.setFieldsValue({
      title: record.title,
      description: record.description,
    });
    setShowDrawer(true);
  };

  const handleDelete = async (id) => {
    try {
      await getDataPrivate(`/api/v1/books/delete/${id}`);
      message.success("Book deleted successfully");
      getBooks();
    } catch (err) {
      message.error("Failed to delete book");
      console.error(err);
    }
  };

  const onFinish = async (values) => {
    setLoadingAdd(true);
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description);

    try {
      if (editMode) {
        const result = await sendDataPrivate(
          `/api/v1/books/update/${editingBookId}`,
          formData,
          "form-data",
          "POST"
        );
        if (result?.success || result?.message === "updated") {
          message.success("Book updated successfully");
        } else {
          message.error("Failed to update book");
        }
      } else {
        const result = await sendDataPrivate("/api/v1/books/create", formData);
        if (result?.id_books || result?.id) {
          message.success("Book successfully added");
        } else {
          message.error("Failed to add book");
        }
      }

      form.resetFields();
      setShowDrawer(false);
      setEditMode(false);
      setEditingBookId(null);
      getBooks();
    } catch (err) {
      message.error(editMode ? "Error updating book" : "Error adding book");
      console.error(err);
    } finally {
      setLoadingAdd(false);
    }
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <>
          <Button type="link" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.id_books)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div className="layout-content">
      <Row gutter={[24, 0]}>
        <Col xs={24}>
          <Card bordered={false} className="circlebox h-full w-full">
            <Title>Books Page</Title>
            <Text style={{ fontSize: "12pt" }}>
              Get Data list of the books. Demonstrate use JWT to retrieve the private endpoints.
            </Text>

            <Divider />
            <Button type="primary" onClick={() => setShowDrawer(true)}>
              + Add Book
            </Button>

            <Divider />

            {errMsg && <Text type="danger">{errMsg}</Text>}

            <Table
              dataSource={dataSources}
              columns={columns}
              rowKey={"id_books"}
              loading={isLoading}
            />
          </Card>
        </Col>
      </Row>

      <Drawer
        title={editMode ? "Edit Book" : "Add New Book"}
        placement="right"
        onClose={() => {
          setShowDrawer(false);
          setEditMode(false);
          setEditingBookId(null);
          form.resetFields();
        }}
        open={showDrawer}
        width={400}
      >
        <Form layout="vertical" onFinish={onFinish} form={form}>
          <Form.Item
            name="title"
            label="Book Title"
            rules={[{ required: true, message: "Title is required" }]}
          >
            <Input placeholder="Enter book title" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Description is required" }]}
          >
            <Input.TextArea rows={3} placeholder="Enter description" />
          </Form.Item>

          <Button type="primary" htmlType="submit" loading={loadingAdd} block>
            {editMode ? "Update Book" : "Add Book"}
          </Button>
        </Form>
      </Drawer>
    </div>
  );
};

export default Books;
