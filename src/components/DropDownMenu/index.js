
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { Dropdown, DropdownButton } from 'react-bootstrap';

import './style.css';

class DropDownMenu extends Component {
    menuClick = (index) => {
        const { filter, id } = this.props;
        const filterData = filter[id];
		const data = Object.assign({}, filterData);
		const length = data.valueList.length;
		_.remove(data.valueList, item => item === filterData.list[index]);
		if (length === data.valueList.length) {
			data.valueList.push(filterData.list[index]);
		}
		let value = '';
		data.valueList.forEach(item => {
			value = value + item + ', ';
		});
        data.value = value;
        let newFilter = this.props.filter.slice();
        newFilter[id] = data;
        this.props.setFilter(newFilter);
	}

    render() {
        const { filter, id } = this.props;
        const data = filter[id];
        return (
            <DropdownButton
                size="lg"
                variant="light"
                title={data.value === '' ? data.placeholder : data.value}
                id={`dropdown-button-drop-${id}`}
                className={`border dropdown-button-drop-${id}`}
            >
                {data.list.length > 0 && data.list.map((item, index) => (
                    <div key={index}>
                        <Dropdown.Item eventKey={index} onClick={() => this.menuClick(index)}>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>{item}</div>{_.findIndex(data.valueList, value => value === item) > -1 && <span>✔</span>}
                            </div>
                        </Dropdown.Item>
                        <Dropdown.Divider />
                    </div>
                ))}
            </DropdownButton>
        );
    }
}

DropDownMenu.propTypes = {
    setFilter: PropTypes.func.isRequired,
    id: PropTypes.number.isRequired,
    filter: PropTypes.array.isRequired,
};

export default DropDownMenu;
