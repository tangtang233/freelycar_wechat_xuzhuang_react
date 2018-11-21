import React from 'react';
import { connect } from 'dva';
import './IndexPage.less';
import Example from '../components/Example.js'
function IndexPage() {
   console.log(document.documentElement.clientWidth)
  return (
    <div className="normal">
      <h1 className="title">哈哈</h1>
      <div className="welcome"/>
      <Example> </Example>
      {/* <ul className="list">
        <li>To get started, edit <code>src/index.js</code> and save to reload.</li>
        <li><a href="https://github.com/dvajs/dva-docs/blob/master/v1/en-us/getting-started.md">Getting Started</a></li>
      </ul> */}
    </div>
  );
}

IndexPage.propTypes = {
};

export default connect()(IndexPage);
