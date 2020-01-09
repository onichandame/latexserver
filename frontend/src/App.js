import React from 'react';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import download from 'downloadjs'

import './App.css';

class App extends React.Component{
  constructor(props)
  {
    super(props)
    this.handleSubmit=this.handleSubmit.bind(this)
    this.onChange=this.onChange.bind(this)
    this.state={
      engine:'pdflatex',
      timeout:10000,
      main:'main.tex',
      input:'project.zip'
    }
  }

  render()
  {
    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Group>
          <Form.Label>Engine</Form.Label>
          <Form.Control as="select" name="engine" onChange={this.onChange} required>
            <option value="pdflatex">pdflatex</option>
            <option value="xelatex">xelatex</option>
          </Form.Control>
        </Form.Group>
        <Form.Group>
          <Form.Label>Timeout(ms)</Form.Label>
          <Form.Control type="text" name="timeout" onChange={this.onChange} placeholder="10000" required />
        </Form.Group>
        <Form.Group>
          <Form.Label>Source File Name</Form.Label>
          <Form.Control type="text" name="main" onChange={this.onChange} placeholder="main.tex" required />
        </Form.Group>
        <Form.Group id="input">
          <Form.Label>Project File</Form.Label>
          <Form.Control type="file" name="input" onChange={this.onChange} placeholder="project.zip" required />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    );
  }

  onChange(e)
  {
    if(e.target.files) this.setState({[e.target.name]:e.target.files[0]})
    else this.setState({[e.target.name]:e.target.value})
  }

  handleSubmit(e)
  {
    e.preventDefault()
    let form=new FormData()
    for(const k of Object.keys(this.state)){
      if(typeof this.state[k] === 'string') form.append(k,this.state[k])
      else if(typeof this.state[k] === 'object') form.append(k,this.state[k])
    }
    fetch('',{
      method:'POST',
      body:form
    })
      .then(res=>{return res.blob()})
      .then(body=>{
        download(body)
      })
      .catch(e=>{
        alert('post failed')
      })
      .finally(()=>{alert('post done')})
  }
}

export default App;
