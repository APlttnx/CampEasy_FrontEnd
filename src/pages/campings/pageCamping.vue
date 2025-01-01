<template>
  <div class="campingSplit">
    <div class="leftColumn">
      <div class="imageCamping">
        <img src="@/assets/defaultCamp.webp" />
      </div>

      <div>
        <p class="address">Nieuwstraat 1, 2630 Aartselaar</p>
      </div>

      <div class="faciliteiten">

      </div>
      <div class="props">
        <div class="propitem">
          <img src="@/assets/icons/Tent.png" class="propImg"/>
          <p>Tent</p>
        </div>
        <div class="propitem">
          <p>50 m²</p>
        </div>
      </div>
      <div>
        <h4>Omschrijving:</h4>
        <div class="textbox">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim
            sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius
            a, semper congue, euismod
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim
            sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius
            a, semper congue, euismod
          </p>
        </div>
      </div>
      <div class="owner">
        <p>Aangeboden door: Arnout Plettinx</p>
        <p>Laatste update: 01/01/2025</p>
      </div>

    </div>


    <div class="rightColumn">
      <div class="costAndBooking">
        <p>€ 15.00 per nacht</p>
      </div>
    </div>
  </div>
</template>


<script>
//import { useCampingStore } from '@/stores/campingStore';

export default{

};


</script>


<style scoped>
.campingSplit {
  display: flex;
  width: 100%;
  justify-content: space-between;
  column-gap: 20px;

}

.leftColumn {
  width: 66.66%;
  border: 1px solid #ef8d05;
}

.rightColumn {
  width: 33.34%;
  border: 1px solid #f70101;
}

.imageCamping {
  position: relative;
  height: 400px;
  overflow: hidden;
}

img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.faciliteiten {
  border: 1px solid #f70101;
  background-color: #ffffff8e;
  margin-top: 10px;
  padding: 20px;
  border-radius: 10px;
  display: flex;
  flex-wrap: wrap;
}

.textbox {
  border: 1px solid #203801;
  background-color: #ffffff8e;
  margin-top: 5px;
  min-height: 80px;
  border-radius: 10px;
  padding-left: 8px;
}

.props{
  display: flex;
  justify-content: space-between;
  width: 75%;
  margin: auto;
  margin-top: 15px;
  height: 50px;
  border: 1px solid #203801;
}

.propitem{
  padding: 10px;
  border-right: 1px solid #203801;
  display:flex;
  width: 50%;
  justify-content: center;
  column-gap: 10px;
}

.propitem:last-child {
  border-right: none;
}

img.propImg{
  width: 40px;
  object-fit: contain;
  display: block;
}

h4 {
  margin-bottom: 5px;
  margin-top: 15px;
  margin-left: 5px;
  font-size: 16px;
}

p {
  margin-top: 8px;
}
p.address{
  font-size: 20px;
  margin-left: 10px;
  font-weight: bold;
  margin-top: 15px;
  margin-bottom: 30px;

}
.owner{
color: gray;
margin: 10px;
}
.owner p{
margin:5px
}

.costAndBooking{
  height:380px;
  border: 1px solid #203801;
  padding: 10px;
}
</style>