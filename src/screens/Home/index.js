import React from 'react';
import { Box, AspectRatio, Image, Stack, HStack, VStack, Text, Heading } from 'native-base';

import firestore from '@react-native-firebase/firestore';

import Img from '../../assets/pilao.jpg';

import { styles } from './styles';

export function Home({ navigation }) {

    function handleNewLot() {
        navigation.navigate("Register")
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.text}>Controllac</Text>
            </View>

            <View>
                <Button
                    title="ESCANEAR"
                    onPress={() => navigation.navigate('Scanner')}
                />
            </View>

            <View>
                <Text>
                    Olá, Talita.
                </Text>

                <Text>
                    Lotes cadastrados:
                </Text>

                <Box
                    shadow="2"
                    rounded="lg"
                    w={{ base: "64", md: "80", lg: "md" }}
                    _light={{ bg: "coolGray.50" }}
                    _dark={{ bg: "gray.700" }}
                >
                    <AspectRatio w="100%" ratio={ratio}>
                        <Image source={Img} alt="image base" />
                    </AspectRatio>

                    <Stack space="2" p="4">
                        <Text color="gray.400">October 1, 2022</Text>
                        <Heading size={["md", "lg", "md"]} fontWeight="medium">
                            Lote de Café Pilão
                        </Heading>
                        <Text>
                            Data de validade: 10/10/2022;
                            Data de fabricação: 10/10/2018;
                        </Text>

                        <HStack space="3" px="4" pb="4">
                            <MoreIcon _light={{ color: "emerald.800" }} _dark={{ color: "emerald.300" }} />
                            <Box
                                px="3"
                                py="2"
                                mb={["4", "5"]}
                                bg="primary.400"
                                rounded="lg"
                            >
                                <Text fontWeight="medium" color="white" fontSize="sm">
                                    CONFERIR VALIDADE
                                </Text>
                            </Box>
                        </HStack>
                    </Stack>
                </Box>

                <FlatList
                    horizontal={true}
                />

                <Button title='Criar' onPress={handleNewLot} />

                <Text>
                    Lotes perto do prazo de validade:
                </Text>
            </View>
        </View>
    );
}