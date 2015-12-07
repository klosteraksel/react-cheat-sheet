import React, { Component } from 'react';

import data from './data.js';

import styles from './styles';
import colors from './colors';

import ReferenceItem from './ReferenceItem.js';
import CategoryList from './CategoryList.js';
import CategoryLabel from './CategoryLabel.js';
import NoResults from './NoResults.js';

import filter from 'lodash.filter';
import without from 'lodash.without';

function filterByCategory(_data, categories = []) {
  if (!categories.length) return _data;

  return filter(_data, ({category}) => categories.includes(category));
}

function filterResults (_data, predicate = '', categories = []) {
  return filter(filterByCategory(_data, categories), (({name}) => {
    return name.match(new RegExp(predicate, 'i'));
  }));
}

function toggleCategory(arr, item, cond) {
  return (cond) ? arr.concat([item]) : without(arr, item);
}

function handleLifecycleFilterChange () {
  this.setState({
    categories: toggleCategory(this.state.categories, 'LIFECYCLE', this.lifecycleCheckbox.checked)
  });
}

function handleChange () {
  this.setState({ predicate: this.searchInput.value });
}

class ReactCheatSheet extends Component {
  constructor (props) {
    super(props);

    this.state = {
      predicate: '',
      categories: [],
    };
  }

  get filteredResults () {
    return filterResults(data, this.state.predicate, this.state.categories);
  }

  render () {
    const results = () => (
      this.filteredResults.map((item, i) => <ReferenceItem key={i} {...item} />)
    );

    return (
      <main>
        <label>
          <input
            autoFocus
            type="text"
            style={styles.searchInput}
            placeholder="Filter by name"
            value={this.state.predicate}
            ref={c => this.searchInput = c}
            onChange={handleChange.bind(this)}
          />
        </label>

        <CategoryList>
          <CategoryLabel
            color={colors.orange}
            active={this.state.categories.includes('LIFECYCLE')}
          >
            <span>Lifecycle{' '}</span>
            <input
              type="checkbox"
              onChange={handleLifecycleFilterChange.bind(this)}
              checked={this.state.categories.includes('LIFECYCLE')}
              ref={c => this.lifecycleCheckbox = c}
            />
          </CategoryLabel>
        </CategoryList>

        <section>
          {(this.filteredResults.length)
           ? results()
           : <NoResults />
          }
        </section>
      </main>
    );
  }
}

export default ReactCheatSheet;
