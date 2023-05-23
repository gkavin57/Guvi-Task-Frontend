import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message } from 'antd'; 
import Layout from "./../components/Layout/Layout";


// const HomePage = () => {
//   return (
//     <Layout>
//       <h1>Home Page</h1>
//     </Layout>
//   );
// };

// export default HomePage; 


const HomePage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const storedData = localStorage.getItem('user');
  const userData = JSON.parse(storedData);
  const userId = userData._id;
  setUserId(userId);


    // Fetch user profile from the backend 
    fetch('https://guvi-task-backend.vercel.app/user/profile', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then(response => response.json())
      .then(data => {
        form.setFieldsValue({
          username: data.username,
          age: data.age,
          dob: data.dob,
          contact: data.contact,
        });
      })
      .catch(error => console.log(error));
  }, [form]);

  const handleUpdate = async values => {
    setLoading(true); 
    let payload = { userId: userId, ...values };
    try {
      // Send update request to the backend
      const response = await fetch('https://guvi-task-backend.vercel.app/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        message.success('Profile updated successfully');
      } else {
        message.error('Failed to update profile');
      }
    } catch (error) {
      console.log(error);
      message.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };
console.log(userId)
  return ( 
    <Layout>
         <div className='profile-page'>
      {/* <h2>Profile</h2> */}
      <Form
        form={form}
        layout="vertical"
        onFinish={handleUpdate}
      >
        <Form.Item
          name="username"
          label="Username"
          rules={[
            { required: true, message: 'Please enter your username' },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="age"
          label="Age"
          rules={[{ required: true, message: 'Please enter your age' }]}
        >
          <Input type="number" />
        </Form.Item>
        <Form.Item
          name="dob"
          label="Date of Birth"
          rules={[
            { required: true, message: 'Please enter your date of birth' },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="contact"
          label="Contact"
          rules={[
            { required: true, message: 'Please enter your contact' },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Update
          </Button>
        </Form.Item>
      </Form>
    </div>
    </Layout>

  );
};

export default HomePage;

