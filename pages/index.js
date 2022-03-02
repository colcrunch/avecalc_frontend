import { 
  Container,
  Flex, 
  Heading, 
  Input, 
  Button, 
  IconButton, 
  Spacer, 
  Box,
  Modal,
  ModalBody,
  ModalOverlay,
  ModalFooter,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  useColorMode, 
  useColorModeValue, 
  useDisclosure,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatGroup,
  Divider} from '@chakra-ui/react'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow} from '@chakra-ui/react'
import { MoonIcon, SettingsIcon } from '@chakra-ui/icons'
import { handler } from './api/hello'
import { useState } from 'react'

function Calculate(size, price) {
  const perm3 = 900
  const collat = 0.01
  return (size*perm3) + (price*collat)
}

export default function Home() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { toggleColorMode } = useColorMode()
  const formBackground = useColorModeValue("gray.200", "gray.700")
  const inputColor = useColorModeValue("gray.100", "gray.600")
  const navOutlineColor = useColorModeValue("gray.300", "gray.600")
  const popColor = useColorModeValue("red.300", "red.600")

  const [size, setSize] = useState('')
  const [price, setPrice] = useState('')
  const [link, setLink] = useState('')
  const [contract, setContract] = useState({collateral:0,price:0,size:0})

  const tooBig = parseInt(size) > 320000

  function createContract() {
    let url = process.env.NEXT_PUBLIC_API_BASE_URL + "/contract"
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "price": Calculate(size, price),
        "collateral": parseFloat(price),
        "size": parseFloat(size),
        "link": link
      })
    })
      .then((res) => res.json())
      .then((json) => setContract(json))
    onOpen()
  }

  return (
    <Container height="100vh" maxWidth="100%" ml={0} p={0}>
      <Box borderWidth="1px" alignItems="center" justifyItems="center">
        <Flex background={formBackground} borderBottom="1px" borderColor={navOutlineColor}>
          <Spacer />
          <Heading size="lg" ml={20} >Ave's Moving Company</Heading>
          <Spacer />
          <IconButton onClick={toggleColorMode} variant="ghost" icon={<MoonIcon />} mt={1} mb={1} mr={1}/>
          <IconButton variant="ghost" icon={<SettingsIcon />} mt={1} mb={1} mr={1}/>
        </Flex>
      </Box>
      <Container>
        <Flex height="94vh" alignItems="center" justifyContent="center">
          <Flex direction="column" background={formBackground} p={12} rounded={6} minW="70%">
            <Heading mb={6}>Calculator</Heading>
            <Popover placement="right" isOpen={tooBig} autoFocus={false}>
              <PopoverTrigger>
                <Input placeholder="Size" type="number" name='size' onChange={event => setSize(event.target.value)} variant="filled" mb={3} background={inputColor} isInvalid={tooBig}/>
              </PopoverTrigger>
              <PopoverContent bg={popColor}>
                <PopoverArrow bg={popColor}/>
                <PopoverBody>
                  Size must be less than 320,000 m<sup>3</sup>
                </PopoverBody>
              </PopoverContent>
            </Popover>
            <Input placeholder="Jita Value" type="number" name='price' onChange={event => setPrice(event.target.value)} variant="filled" mb={3} background={inputColor}/>
            <Input placeholder="Janice Link" name='link' variant="filled" mb={6} background={inputColor} onChange={event => setLink(event.target.value)}/>
            <Button colorScheme="cyan" onClick={createContract} disabled={!price | !size | !link | tooBig}>Calculate</Button>
          </Flex>
        </Flex>
      </Container>
      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent maxW="35%">
                <ModalHeader>Contract Information</ModalHeader>
                <ModalCloseButton _focus={false}/>
                <ModalBody pb={6}>
                  <StatGroup>
                    <Stat>
                      <StatLabel>Contractor</StatLabel>
                      <StatNumber>Daddy Avellett</StatNumber>
                      <StatHelpText>Assign to this person</StatHelpText>
                    </Stat>
                    <Stat>
                      <StatLabel>Reference</StatLabel>
                      <StatNumber>{contract.ref}</StatNumber>
                      <StatHelpText>Set Description to This</StatHelpText>
                    </Stat>
                  </StatGroup>
                  <Divider />
                  <StatGroup>
                    <Stat>
                      <StatLabel>Collateral</StatLabel>
                      <StatNumber>{contract.collateral.toLocaleString()} ISK</StatNumber>
                      <StatHelpText>Set Collateral to This</StatHelpText>
                    </Stat>
                    <Stat>
                      <StatLabel>Reward</StatLabel>
                      <StatNumber>{contract.price.toLocaleString()} ISK</StatNumber>
                      <StatHelpText>Set Reward to This</StatHelpText>
                    </Stat>
                  </StatGroup>
                  <Divider />
                  <StatGroup>
                    <Stat>
                      <StatLabel>Size</StatLabel>
                      <StatNumber>{contract.size.toLocaleString()} m<sup>3</sup></StatNumber>
                      <StatHelpText>Make sure Volume matches</StatHelpText>
                    </Stat>
                    <Stat>
                      <StatLabel>Destination</StatLabel>
                      <StatNumber>D4-2XN - Vladivostok</StatNumber>
                      <StatHelpText>Set Destination to this</StatHelpText>
                    </Stat>
                  </StatGroup>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={onClose} colorScheme="cyan">Close</Button>
                </ModalFooter>
            </ModalContent>
      </Modal>
    </Container>
  )
}
