import React, { Component, useState } from "react";
import Axios from 'axios';

export default class TestAPI extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
        }
    }

    componentDidMount() {
        Axios.get("https://localhost:7153/Users/byId?id=1").then(json => {
            console.log(json);
        });
    }

    render() {
        //const { items } = this.state;

        return (
            <p> TEST </p>
        )
    }

}


{/*<button onClick={getJoke}> Press to impress) </button>*/}
{/*{items.map(item => {*/}
{/*})}*/}