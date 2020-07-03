import React, {Component} from 'react';
import {Button, Form, Input, Layout, Menu, Table, Tag} from 'antd';
import logo from './images/ghlogo.png';
import './App.css';
import axios from 'axios';
const { Header, Content, Footer } = Layout;

const api = {
  baseUrl : "https://api.github.com",
  client_id : "3e550c2ad7e4c5a2",
  client_secret : "7c7a9ecaf707856bfb4e4419680070b85099f4c5"
}

class Dashboard extends Component{
  constructor(){
    super();
    this.state = {
      dataSource: [],
      dataDetails: [],
      menu: '1',
      user: "",
      repo: '',
      details: false,
    }
  }

  showMenu = key =>{
    this.setState({
      menu : key
    });
  }

  showDetails = record =>{
    axios.get(api.baseUrl
        + "/repos/"+ this.state.user
        + "/" +record.repo + "/issues"
      )
      .then((res) => {
        this.setState({
          details : true,
          dataDetails: res.data,
          repo: record.repo
        })
      })

  }

  onFinish = values => {
    axios.get(api.baseUrl
        + "/users/" + values.user + "/repos"
      )
      .then((res) => {
        this.setState({
          dataSource : res.data,
          user: values.user,
        })
      })


  };

  onFinishO = values => {
    axios.get(api.baseUrl
        + "/orgs/" + values.user + "/repos"
      )
      .then((res) => {
        this.setState({
          dataSource : res.data,
          user: values.user,
        })
      })
  };

  render(){
    var dataSource = [];
    var data = this.state.dataSource;
    for (var i = 0; i < parseInt(data.length, 10); i++) {
        dataSource.push({
            repo: data[i].name,
            owner: {
              name: data[i].owner.login,
              url: data[i].owner.html_url
            },
            details: 'See More'
        });
    }

    var details = this.state.dataDetails;
    var dataDetails = [];
    for (var i = 0; i < parseInt(details.length, 10); i++) {
        var dataLabels = [];
        var dl = details[i].labels;
        dl.map(dli=> (
          dataLabels.push({
              name: dli.name,
              color: "#" + dli.color,
          })
        ));
        dataDetails.push({
            title: details[i].title,
            state: details[i].state,
            user: {
              name: details[i].user.login,
              url: details[i].user.html_url
            },
            tags: dataLabels

        });
    }

      const columnsDetails = [
        {
          title: 'Issue title',
          dataIndex: 'title',
          key: 'title',
        },
        {
          title: 'State',
          dataIndex: 'state',
          key: 'state',
        },
        {
          title: 'Author',
          dataIndex: 'user',
          key: 'user',
          render: user => <a href={user.url}>{user.name}</a>,
        },
        {
          title: 'Tags/Labels',
          dataIndex: 'tags',
          key: 'tags',
          render: tags =>
        <>
          {tags.map(tag => (
            console.log(tag),
            <Tag color={tag.color} key={tag}>
              {tag.name}
            </Tag>
          ))}
        </>
        }
      ];
      const columns = [
        {
          title: 'Repository',
          dataIndex: 'repo',
          key: 'repo',
        },
        {
          title: 'Owner',
          dataIndex: 'owner',
          key: 'owner',
          render: owner => <a href={owner.url}>{owner.name}</a>,
        },
        {
          title: 'Details',
          dataIndex: 'details',
          key: 'details',
          render: (text, record) => <a onClick={()=> this.showDetails(record)}>{text}</a>,
        },
      ];
    return (
       <Layout >
       <Header style={{ padding: '0 50px', minHeight: '120px' }}>

       <img src={logo} alt="Logo" style={{ width: '100px', float: 'left', margin: '16px 24px 16px 0' }}/>
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']} style={{ margin: '16px 24px 16px 0'  }}>

            <Menu.Item key="1" onClick={(e) => this.showMenu(e.key)} >Users</Menu.Item>
            <Menu.Item key="2" onClick={(e) => this.showMenu(e.key)} >Organizations</Menu.Item>
          </Menu>
        </Header>
          <Content style={{ padding: '0 50px', minHeight: '440px' }}>
          {this.state.details!==true?(
            this.state.menu === '1'?(
              <>
              <Form
                onFinish={this.onFinish}>
                  <Form.Item
                    name="user"
                    label="Username"
                    style={{ paddingTop: 10 }}>
                    <Input />
                  </Form.Item>
                  <Form.Item  style={{ paddingTop: 5 }}>
                    <Button type="primary" htmlType="submit">
                      Confirmar
                    </Button>
                  </Form.Item>
              </Form>
              <Table dataSource={dataSource} columns={columns} />
            </>
            ):(
              <>
              <Form
                  onFinish={this.onFinishO}>
                    <Form.Item
                      name="user"
                      label="Organization name"
                      style={{ paddingTop: 10 }}>
                      <Input />
                    </Form.Item>
                    <Form.Item  style={{ paddingTop: 5 }}>
                      <Button type="primary" htmlType="submit">
                        Confirmar
                      </Button>
                    </Form.Item>
                </Form>
                <Table dataSource={dataSource} columns={columns} />
                </>
            )
          ):(<Table dataSource={dataDetails} columns={columnsDetails} />)}
          </Content>
        <Footer style={{ textAlign: 'center' }}>Beatricce ©2020</Footer>

        </Layout>
    )
  }
}

function App() {
  return (
    <div className="App">
      <Dashboard />
    </div>
  );
}

export default App;
