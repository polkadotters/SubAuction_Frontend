import React from 'react';
import { useSubstrate } from '@/substrate-lib';

import { TimeIcon } from '@chakra-ui/icons';
import {
  Box,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Flex,
} from '@chakra-ui/react';

interface BlockNumberType {
  finalized: boolean;
}

const Main = (props: BlockNumberType): JSX.Element => {
  const { api } = useSubstrate();
  const { finalized } = props;
  const [blockNumber, setBlockNumber] = React.useState(0);
  const [blockNumberTimer, setBlockNumberTimer] = React.useState(0);

  const bestNumber = finalized
    ? api.derive.chain.bestNumberFinalized
    : api.derive.chain.bestNumber;

  React.useEffect(() => {
    let unsubscribeAll = null;

    bestNumber((number) => {
      setBlockNumber(number.toNumber());
      setBlockNumberTimer(0);
    })
      .then((unsub) => {
        unsubscribeAll = unsub;
      })
      .catch(console.error);

    return () => unsubscribeAll && unsubscribeAll();
  }, [bestNumber]);

  const timer = () => {
    setBlockNumberTimer((time) => time + 1);
  };

  React.useEffect(() => {
    const id = setInterval(timer, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <Box>
      <Stat>
        <StatLabel>
          {(finalized ? 'Finalized' : 'Current') + ' Block'}
        </StatLabel>
        <Flex align="center" justify="space-between">
          <StatNumber>{blockNumber}</StatNumber>
          <StatHelpText mb="0">
            <Flex align="center">
              <TimeIcon mr="2" /> {blockNumberTimer}
            </Flex>
          </StatHelpText>
        </Flex>
      </Stat>
    </Box>
  );
};

export default function BlockNumber(props) {
  const { api } = useSubstrate();
  return api.derive &&
    api.derive.chain &&
    api.derive.chain.bestNumber &&
    api.derive.chain.bestNumberFinalized ? (
    <Main {...props} />
  ) : null;
}
