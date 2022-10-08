import React from 'react';
import { Box, AspectRatio, Image, Stack, HStack, Text, VStack, Heading, Button, Center } from 'native-base';
import { FlatList } from 'react-native'

import firestore from '@react-native-firebase/firestore';

import Img from '../../assets/pilao.jpg';

import { styles } from './styles';

export function Home({ navigation }) {

    function handleNewLot() {
        navigation.navigate("Register")
    }

    return (
        <VStack>
            <VStack
                marginTop="8"
                width="100%"
                height="50"
                backgroundColor="#320059"
                justifyContent="center"
                alignItems="center"
                flexDirection="row"
            >
                <Text style={styles.text}>Controllac</Text>
            </VStack>

            <VStack>
                <Button
                    onPress={() => navigation.navigate('Scanner')}
                />
            </VStack>

            <VStack>
                <Text fontSize="3xl" fontWeight="bold" mt="4" ml="4">
                    Olá, Talita.
                </Text>

                <Text ml="4" fontSize="2xl">
                    Lotes cadastrados:
                </Text>

                <Box
                    ml="4"
                    mt="4"
                    shadow="2"
                    rounded="lg"
                    w={{ base: "64", md: "80", lg: "md" }}
                    _light={{ bg: "coolGray.50" }}
                    _dark={{ bg: "gray.700" }}
                >
                    <AspectRatio w="4" h="32">
                        <Image source={Img} w="32" h="32" alt="image base" />
                    </AspectRatio>
                    <Stack space="2" p="4">
                        <Heading fontWeight="medium">
                            Lote de Café Pilão
                        </Heading>
                        <Text>
                            Data de Validade: 00/00/0000
                        </Text>
                        <Text>
                            Data de Fabricação: 00/00/0000
                        </Text>
                    </Stack>
                    <HStack space="3" px="4" pb="4">
                        <Text _light={{ color: "emerald.800" }} _dark={{ color: "emerald.300" }}>
                            Verificar validade
                        </Text>
                    </HStack>
                </Box>


            </VStack>
        </VStack>
    );
}