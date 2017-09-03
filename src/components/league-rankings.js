import React from 'react';
import {
  Panel,
  ButtonGroup,
  ButtonToolbar,
  Button,
  Table,
  Grid,
  Col,
  Row
} from 'react-bootstrap';
import { sort } from './sort-array';
import TableHeader from './table-header';

export default class LeagueRankings extends React.Component {
  state = {
    sortColumn: 'uses',
    sortDirection: 'up',
    data_to_display: 'total_points'
  };

  setDataToDisplay = e => {
    this.setState({ data_to_display: e.target.value });
  };

  static columnHeaders = [
    { text: 'Name', sortColumn: 'name', sortDirection: 'down' },
    {
      text: 'Two Weeks Ago',
      sortColumn: 'last_last_week',
      sortDirection: 'up'
    },
    { text: 'Last Week', sortColumn: 'last_week', sortDirection: 'up' },
    { text: 'This Week', sortColumn: 'this_week', sortDirection: 'up' }
  ];

  render() {
    const calcStats = this.props.calcStats;
    const snapshot_table = {};
    // should be three iterations, starting with this week
    for (let i = 0; i < calcStats.weapons_stats.length; i++) {
      Object.keys(calcStats.weapons_stats[i]).forEach(weapon => {
        if (weapon in snapshot_table) {
          snapshot_table[weapon].display_stats.push({
            uses_by_week: calcStats.weapons_stats[i][weapon].uses,
            total_points_by_week:
              calcStats.weapons_stats[i][weapon].total_points,
            avg_points_by_week: calcStats.weapons_stats[i][weapon].avg_points
          });
        } else {
          snapshot_table[weapon] = {
            name: calcStats.weapons_stats[i][weapon].name,
            display_stats: [
              {
                uses_by_week: calcStats.weapons_stats[i][weapon].uses,
                total_points_by_week:
                  calcStats.weapons_stats[i][weapon].total_points,
                avg_points_by_week:
                  calcStats.weapons_stats[i][weapon].avg_points
              }
            ]
          };
        }
      });
    }

    const weapons_out = [];
    Object.keys(snapshot_table).forEach(weapon =>
      weapons_out.push({
        name: snapshot_table[weapon].name,
        uses: {
          this_week: snapshot_table[weapon].display_stats[0]['uses_by_week'],
          last_week:
            snapshot_table[weapon].display_stats.length > 1
              ? snapshot_table[weapon].display_stats[1]['uses_by_week']
              : 0,
          last_last_week:
            snapshot_table[weapon].display_stats.length > 2
              ? snapshot_table[weapon].display_stats[2]['uses_by_week']
              : 0
        },
        total_points: {
          this_week:
            snapshot_table[weapon].display_stats[0]['total_points_by_week'],
          last_week:
            snapshot_table[weapon].display_stats.length > 1
              ? snapshot_table[weapon].display_stats[1]['total_points_by_week']
              : 0,
          last_last_week:
            snapshot_table[weapon].display_stats.length > 2
              ? snapshot_table[weapon].display_stats[2]['total_points_by_week']
              : 0
        },
        avg_points: {
          this_week:
            snapshot_table[weapon].display_stats[0]['avg_points_by_week'],
          last_week:
            snapshot_table[weapon].display_stats.length > 1
              ? snapshot_table[weapon].display_stats[1]['avg_points_by_week']
              : 0,
          last_last_week:
            snapshot_table[weapon].display_stats.length > 2
              ? snapshot_table[weapon].display_stats[2]['avg_points_by_week']
              : 0
        }
      })
    );

    for (let j = 0; j < weapons_out.length; j++) {
      weapons_out[j]['uses'].this_week_percent =
        weapons_out[j]['uses'].this_week / calcStats.totals['uses'][0] * 100;
      weapons_out[j]['uses'].last_week_percent =
        weapons_out[j]['uses'].last_week / calcStats.totals['uses'][1] * 100;
      weapons_out[j]['uses'].last_last_week_percent =
        weapons_out[j]['uses'].last_last_week /
        calcStats.totals['uses'][2] *
        100;
      weapons_out[j]['uses'].diff_this_to_last =
        weapons_out[j]['uses'].this_week_percent -
        weapons_out[j]['uses'].last_week_percent;
      weapons_out[j]['uses'].diff_last_to_last_last =
        weapons_out[j]['uses'].last_week_percent -
        weapons_out[j]['uses'].last_last_week_percent;

      weapons_out[j]['total_points'].this_week_percent =
        weapons_out[j]['total_points'].this_week /
        calcStats.totals['total_points'][0] *
        100;
      weapons_out[j]['total_points'].last_week_percent =
        weapons_out[j]['total_points'].last_week /
        calcStats.totals['total_points'][1] *
        100;
      weapons_out[j]['total_points'].last_last_week_percent =
        weapons_out[j]['total_points'].last_last_week /
        calcStats.totals['total_points'][2] *
        100;
      weapons_out[j]['total_points'].diff_this_to_last =
        weapons_out[j]['total_points'].this_week_percent -
        weapons_out[j]['total_points'].last_week_percent;
      weapons_out[j]['total_points'].diff_last_to_last_last =
        weapons_out[j]['total_points'].last_week_percent -
        weapons_out[j]['total_points'].last_last_week_percent;

      weapons_out[j]['avg_points'].diff_this_to_last =
        weapons_out[j]['avg_points'].this_week -
        weapons_out[j]['avg_points'].last_week;
      weapons_out[j]['avg_points'].diff_last_to_last_last =
        weapons_out[j]['avg_points'].last_week -
        weapons_out[j]['avg_points'].last_last_week;
    }

    sort(weapons_out, this.state.sortColumn, this.state.sortDirection);

    return (
      <Panel header={<h3>League Weapon Stats</h3>}>
        <Grid fluid>
          <Row>
            <Col sm={12} md={12}>
              <ButtonToolbar style={{ marginBottom: '10px' }}>
                <ButtonGroup>
                  <Button
                    onClick={this.props.showTeams}
                    active={this.props.full_teams}
                  >
                    Teams
                  </Button>
                  <Button
                    onClick={this.props.showPairs}
                    active={!this.props.full_teams}
                  >
                    Pairs
                  </Button>
                </ButtonGroup>
                <ButtonGroup>
                  <Button
                    onClick={this.props.setRegion}
                    value="ALL"
                    active={this.props.region === 'ALL'}
                  >
                    All Regions
                  </Button>
                  <Button
                    onClick={this.props.setRegion}
                    value="JP"
                    active={this.props.region === 'JP'}
                  >
                    Japan
                  </Button>
                  <Button
                    onClick={this.props.setRegion}
                    value="US"
                    active={this.props.region === 'US'}
                  >
                    NA/AU/NZ
                  </Button>
                  <Button
                    onClick={this.props.setRegion}
                    value="EU"
                    active={this.props.region === 'EU'}
                  >
                    Europe
                  </Button>
                </ButtonGroup>
                <ButtonGroup>
                  <Button
                    onClick={this.setDataToDisplay}
                    value="uses"
                    active={this.state.data_to_display === 'uses'}
                  >
                    Uses
                  </Button>
                  <Button
                    onClick={this.setDataToDisplay}
                    value="total_points"
                    active={this.state.data_to_display === 'total_points'}
                  >
                    Total Rating
                  </Button>
                  <Button
                    onClick={this.setDataToDisplay}
                    value="avg_points"
                    active={this.state.data_to_display === 'avg_points'}
                  >
                    Average Rating
                  </Button>
                </ButtonGroup>
              </ButtonToolbar>
            </Col>
          </Row>
          <Row>
            <Col sm={12} md={12}>
              <Table striped bordered condensed hover>
                <thead>
                  <tr>
                    {LeagueRankings.columnHeaders.map(header =>
                      <TableHeader
                        key={header.text}
                        setState={this.setState.bind(this)}
                        sort={{
                          sortColumn: header.sortColumn,
                          sortDirection: header.sortDirection
                        }}
                        text={header.text}
                        sortColumn={this.state.sortColumn}
                      />
                    )}
                  </tr>
                </thead>
                <tbody>
                  {weapons_out.map(weapon =>
                    <tr key={weapon.name}>
                      <td>
                        {weapon.name}
                      </td>
                      <td>
                        {weapon[
                          this.state.data_to_display
                        ].last_last_week.toFixed(0)}
                        {this.state.data_to_display === 'avg_points'
                          ? ``
                          : ` (${weapon[
                              this.state.data_to_display
                            ].last_last_week_percent.toFixed(1)}%)`}
                      </td>
                      <td>
                        {weapon[this.state.data_to_display].last_week.toFixed(
                          0
                        )}
                        {this.state.data_to_display === 'avg_points'
                          ? ` (${weapon[
                              this.state.data_to_display
                            ].diff_last_to_last_last.toFixed(1)})`
                          : ` (${weapon[
                              this.state.data_to_display
                            ].last_week_percent.toFixed(1)}% ${weapon[
                              this.state.data_to_display
                            ].diff_last_to_last_last.toFixed(1)})`}
                      </td>
                      <td>
                        {weapon[this.state.data_to_display].this_week.toFixed(
                          0
                        )}
                        {this.state.data_to_display === 'avg_points'
                          ? ` (${weapon[
                              this.state.data_to_display
                            ].diff_this_to_last.toFixed(1)})`
                          : ` (${weapon[
                              this.state.data_to_display
                            ].this_week_percent.toFixed(1)}% ${weapon[
                              this.state.data_to_display
                            ].diff_this_to_last.toFixed(1)})`}
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Col>
          </Row>
        </Grid>
      </Panel>
    );
  }
}