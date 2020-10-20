import React, { useEffect, useState } from 'react';
import { DataGrid } from '@material-ui/data-grid';
import { Button, Chip, Container } from '@material-ui/core';
import { getPutData } from '../service/putapi';
import moment from 'moment';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import ScrollableTabsButtonAuto from './symboltab';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'left',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));

const Options = (props) => {
  const [rows, setRows] = useState([]);
  const classes = useStyles();
  const [symbols, setSymbols] = useState([]);
  const [symbol, setSymbol] = useState();
  const [selectedSymbol, setSelectedSymbol] = useState();
  const [value, setValue] = React.useState(0);

  useEffect(() => {
    const localSymbols = localStorage.getItem('symbols');
    if (localSymbols === undefined || localSymbols === null) return;
    const newSymbols = localSymbols.split(',');
    if (localSymbols) setSymbols(newSymbols);
    getTableData(newSymbols[0]);

    localStorage.setItem('selectedSymbol', newSymbols[0]);

    const interval = setInterval(() => {
      getTableData(localStorage.getItem('selectedSymbol'));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const columns = [
    { field: 'id', hide: true },
    { field: 'symbol', headerName: 'Symbol', width: 80 },
    { field: 'exp', headerName: 'Expiration', width: 120 },
    { field: 'strike', headerName: 'Strike', width: 100 },
    { field: 'stock', headerName: 'Stock', width: 100 },
    { field: 'last', headerName: 'Last', width: 100 },
    { field: 'bid', headerName: 'Bid', width: 100 },
    { field: 'ask', headerName: 'Ask', width: 100 },
    { field: 'days', headerName: 'Days', width: 100 },
  ];

  const getTableData = async (sym) => {
    const data = await getPutData(sym);

    const newRows = [];
    for (const exp in data.putExpDateMap) {
      for (const strike in data.putExpDateMap[exp]) {
        data.putExpDateMap[exp][strike].forEach(
          ({ last, bid, ask, daysToExpiration }, index) => {
            newRows.push({
              id: `${exp}-${strike}-${index}`,
              symbol: sym,
              exp,
              stock: data.underlying.last,
              strike,
              last,
              bid,
              ask,
              days: daysToExpiration,
            });
          }
        );
      }
    }
    setRows(newRows);
  };

  useEffect(() => {
    console.log('getting table data');
    getTableData(selectedSymbol);
  }, [, selectedSymbol]);

  const addSymbol = () => {
    if (symbol === undefined) return;
    if (symbols.includes(symbol)) return;
    const newSymbols = symbols.slice();
    newSymbols.push(symbol);
    document.forms.symform.symfield.value = '';
    setSymbol(undefined);
    setSymbols(newSymbols);
    localStorage.setItem('symbols', newSymbols);
    if (newSymbols.length === 1) {
      getTableData(symbol);
    }
  };

  const removeSymbol = (sym) => {
    debugger;
    if (sym === selectedSymbol) {
      setValue(0);
      setSelectedSymbol(symbols[0]);
    }

    const newSymbols = symbols.filter((s) => s !== sym);
    setSymbols(newSymbols);
    localStorage.setItem('symbols', newSymbols);

    if (newSymbols.length === 1) getTableData('');
  };

  const onSymbolSelect = (sym) => {
    setSelectedSymbol(symbols[sym]);
    localStorage.setItem('selectedSymbol', symbols[sym]);
  };

  return (
    <Container>
      <br />
      <Typography
        variant="h4"
        gutterBottom
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        Options - Put Watch
      </Typography>

      <br />
      <Grid container spacing={2}>
        <Grid item xs={10} sm={4}>
          <form
            id="symform"
            className={classes.root}
            noValidate
            autoComplete="off"
          >
            <TextField
              id="symfield"
              placeholder="Symbol"
              value={symbol}
              onChange={(e) => {
                setSymbol(e.target.value);
              }}
            />
            <Button
              variant="outlined"
              color="primary"
              onClick={() => addSymbol()}
            >
              Add Symbol
            </Button>
          </form>
        </Grid>
        <Grid item xs={14} sm={8}>
          <div className={classes.root}>
            {symbols &&
              symbols.map((s, index) => (
                <Chip
                  key={`s-${index}`}
                  label={s}
                  color="primary"
                  onDelete={(e) => removeSymbol(s)}
                />
              ))}
          </div>
        </Grid>
      </Grid>

      <br />

      <ScrollableTabsButtonAuto
        symbols={symbols}
        value={value}
        setValue={setValue}
        onSymbolSelect={onSymbolSelect}
      />

      <br />
      <div
        style={{
          height: 450,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <DataGrid rows={rows} columns={columns} pageSize={10} />
      </div>
    </Container>
  );
};

export default Options;
