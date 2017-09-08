import React from 'react';
import { Button } from 'react-bootstrap';
import { Subscriber } from 'react-broadcast';
import { FormattedMessage } from 'react-intl';
import flatten from 'flat';
import json2csv from 'json2csv';
import { remote, ipcRenderer } from 'electron';
const { dialog } = remote;

class ExportBattlesToCsvButton extends React.Component {
  convertBattlesToCsv(battles) {
    const battlesFlattened = battles.map(battle => {
      return flatten(battle);
    });

    return json2csv({ data: battlesFlattened });
  }

  exportBattlesToCsv = () => {
    // loop through current and get battles
    const { splatnet } = this.props;
    const battles = splatnet.current.results.results.map(battle => {
      return splatnet.comm.getBattle(battle.battle_number);
    });

    const battlesCsv = this.convertBattlesToCsv(battles);
    dialog.showSaveDialog(
      {
        filters: [{ name: 'csv', extensions: ['csv'] }]
      },
      file => {
        console.log(file);
        ipcRenderer.send('saveBattlesToCsv', file, battlesCsv);
      }
    );
  };

  render() {
    const { splatnet } = this.props;
    return (
      <Button onClick={this.exportBattlesToCsv}>
        <FormattedMessage
          id="Results.exportBattlesToCsv"
          defaultMessage="Export to CSV"
        />
      </Button>
    );
  }
}

const ButtonInjected = () => {
  return (
    <Subscriber channel="splatnet">
      {splatnet => {
        return <ExportBattlesToCsvButton splatnet={splatnet} />;
      }}
    </Subscriber>
  );
};

export default ButtonInjected;
