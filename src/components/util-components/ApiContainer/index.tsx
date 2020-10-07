import React, { Component } from "react";
import Markdown from 'react-markdown';
import SyntaxHighlighter from 'react-syntax-highlighter';
import syntaxTheme from "./HLTheme";


interface ApiContainerProps {
  code: any;
}

interface ApiContainerState {
  markdown: any;
}

class ApiContainer extends Component<ApiContainerProps, ApiContainerState> {

	constructor(props) {
    super(props);
    this.state = {
      markdown: ''
    } as {markdown: string};
  }

  componentDidMount() {
    fetch(this.props.code).then(
      res => res.text()
    ).then(
      md => {
        this.setState({ 
          markdown: md
        })
      }
    );
  }

  render() {
    return (
			<div className="api-container">
        <Markdown 
          source={this.state.markdown}
          renderers={
            {
              heading: h => (
                <div className={`api-title h${h.level} ${h.children[0].props.value.includes('title: ')? '':h.children[0].props.value.split('').join('').replace(/\s/g, '-').toLowerCase()}`}>
                  {h.children[0].props.value.includes('title: ')? h.children[0].props.value.replace('title: ', '') : h.children}
                </div>
              ),
              paragraph: p => (
                <React.Fragment>
                  {p.children[0].props.nodeKey === 'text-2-1-0'? '' :<p>{p.children}</p>}
                </React.Fragment>
              ),
              code: c => (
                <div className="api-code-highligher">
                  <SyntaxHighlighter style={syntaxTheme}>
                    {c.value}
                  </SyntaxHighlighter>
                </div>
              )
            }
          }
        />
			</div>
		);
  }
}

export default ApiContainer;
