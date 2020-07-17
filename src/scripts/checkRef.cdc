import FungibleToken from 0x01

pub fun main():Bool{
    return getAccount(0x02).getCapability(/public/MainReceiver)!.check<&FungibleToken.Vault{FungibleToken.Receiver}>()
}