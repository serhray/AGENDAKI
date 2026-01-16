const fetch = require('node-fetch')

async function testSlots() {
  try {
    const url = 'http://localhost:3000/api/booking/clinica-veterinaria-2/slots?date=2026-01-13&serviceId=cmka8xgv200017bokjbwx6csi&professionalId=cmk9zwcow0001usjotyyv7kno'
    
    console.log('\n🔍 Testando API de slots...\n')
    console.log('URL:', url)
    
    const response = await fetch(url)
    const data = await response.json()
    
    console.log('\nStatus:', response.status)
    console.log('\nResposta:', JSON.stringify(data, null, 2))
    
    if (data.slots) {
      const available = data.slots.filter(s => s.available)
      console.log(`\n✅ Total de slots: ${data.slots.length}`)
      console.log(`✅ Slots disponíveis: ${available.length}`)
      console.log('\nPrimeiros 5 horários disponíveis:')
      available.slice(0, 5).forEach(s => console.log(`  - ${s.time}`))
    }
  } catch (error) {
    console.error('Erro:', error.message)
  }
}

testSlots()
